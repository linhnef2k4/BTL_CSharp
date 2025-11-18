using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Freelancer.Services
{
    public class ConversationService : IConversationService
    {
        private readonly ApplicationDbContext _context;

        public ConversationService(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- API 1: BẮT ĐẦU HOẶC TÌM CUỘC TRÒ CHUYỆN ---
        public async Task<int> StartConversationAsync(int currentUserId, int recipientUserId)
        {
            if (currentUserId == recipientUserId)
            {
                throw new System.Exception("Không thể tự chat với chính mình.");
            }

            // Tìm xem 2 người này đã có phòng chat CHUNG chưa
            // (Đây là một query LINQ phức tạp)
            var existingConversation = await _context.ConversationUsers
                .Where(cu => cu.UserId == currentUserId) // Tìm phòng của User A
                .Select(cu => cu.Conversation) // Lấy các phòng đó
                .Where(c => c.Participants.Any(p => p.UserId == recipientUserId)) // Xem phòng nào có User B
                .FirstOrDefaultAsync();

            if (existingConversation != null)
            {
                return existingConversation.Id; // Đã có, trả về ID
            }

            // --- Nếu chưa có, tạo phòng mới ---
            var newConversation = new Conversation();
            _context.Conversations.Add(newConversation);
            await _context.SaveChangesAsync(); // Phải Save để lấy ID

            // Thêm "Chìa khóa" cho 2 người
            _context.ConversationUsers.Add(new ConversationUser { UserId = currentUserId, ConversationId = newConversation.Id });
            _context.ConversationUsers.Add(new ConversationUser { UserId = recipientUserId, ConversationId = newConversation.Id });
            await _context.SaveChangesAsync();

            return newConversation.Id;
        }

        // --- API 2: LẤY "HỘP THƯ" ---
        public async Task<IEnumerable<ConversationDto>> GetMyConversationsAsync(int currentUserId)
        {
            // SỬA LỖI: Bắt đầu từ _context.Conversations (thay vì .ConversationUsers)
            var conversations = await _context.Conversations
                .Where(c => c.Participants.Any(p => p.UserId == currentUserId)) // <-- Tìm phòng có TÔI
                .Include(c => c.Participants)                   // <-- Include (Hợp lệ)
                    .ThenInclude(p => p.User)
                        .ThenInclude(u => u.Seeker)
                .Include(c => c.Messages) // Lấy tin nhắn
                                          // Sắp xếp theo tin nhắn mới nhất
                .OrderByDescending(c => c.Messages.Max(m => (DateTime?)m.SentDate) ?? c.CreatedDate)
                .ToListAsync();

            // Map sang DTO (Phần này giữ nguyên)
            var dtos = new List<ConversationDto>();
            foreach (var conv in conversations)
            {
                // Tìm "Người kia" (không phải mình)
                var otherParticipant = conv.Participants.FirstOrDefault(p => p.UserId != currentUserId)?.User;
                if (otherParticipant == null) continue;

                var lastMessage = conv.Messages.OrderByDescending(m => m.SentDate).FirstOrDefault();

                dtos.Add(new ConversationDto
                {
                    Id = conv.Id,
                    OtherParticipantId = otherParticipant.Id,
                    OtherParticipantFullName = otherParticipant.FullName,
                    OtherParticipantHeadline = otherParticipant.Seeker?.Headline ?? "Thành viên",
                    LastMessage = lastMessage?.Content ?? "Chưa có tin nhắn",
                    LastMessageDate = lastMessage?.SentDate ?? conv.CreatedDate,
                    IsRead = (lastMessage == null) || (lastMessage.SenderId == currentUserId) || (lastMessage.IsRead)
                });
            }
            return dtos;
        }

        // --- API 3: LẤY LỊCH SỬ TIN NHẮN ---
        public async Task<IEnumerable<MessageDto>> GetMessagesAsync(int conversationId, int currentUserId)
        {
            // 1. Kiểm tra xem mình có "chìa khóa" (quyền) vào phòng này không
            var hasAccess = await _context.ConversationUsers
                .AnyAsync(cu => cu.ConversationId == conversationId && cu.UserId == currentUserId);

            if (!hasAccess)
            {
                return null; // Trả về null để Controller báo lỗi 403 Forbidden
            }

            // 2. Lấy tin nhắn VÀ đánh dấu "Đã đọc"
            var messages = await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .Include(m => m.Sender)
                .OrderBy(m => m.SentDate)
                .ToListAsync();

           
            // 3. Map sang DTO
            return messages.Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content,
                SentDate = m.SentDate,
                IsRead = m.IsRead,
                SenderId = m.SenderId,
                SenderFullName = m.Sender.FullName
            });
        }
    }
}