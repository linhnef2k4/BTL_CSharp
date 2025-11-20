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
        // --- HÀM LẤY HỘP THƯ (CẬP NHẬT ĐẾM SỐ TIN CHƯA ĐỌC) ---
        public async Task<IEnumerable<ConversationDto>> GetMyConversationsAsync(int currentUserId)
        {
            // 1. Lấy danh sách phòng chat mà user tham gia
            // Bắt đầu từ Conversations để có thể dùng Include cho Participants, User, Seeker và Messages
            var conversations = await _context.Conversations
                .Where(c => c.Participants.Any(p => p.UserId == currentUserId)) // Tìm những phòng có chứa User hiện tại
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                        .ThenInclude(u => u.Seeker)
                .Include(c => c.Messages) // Lấy tất cả tin nhắn
                                          // Sắp xếp theo tin nhắn mới nhất
                .OrderByDescending(c => c.Messages.Max(m => (DateTime?)m.SentDate) ?? c.CreatedDate)
                .ToListAsync();

            var dtos = new List<ConversationDto>();

            foreach (var conv in conversations)
            {
                // Tìm "Người kia" (người không phải là currentUserId)
                var otherParticipant = conv.Participants.FirstOrDefault(p => p.UserId != currentUserId)?.User;

                // Bỏ qua nếu là phòng lỗi (không tìm thấy người kia)
                if (otherParticipant == null) continue;

                // Lấy tin nhắn cuối cùng để hiển thị preview
                var lastMessage = conv.Messages.OrderByDescending(m => m.SentDate).FirstOrDefault();

                // --- QUAN TRỌNG: TÍNH TOÁN SỐ TIN CHƯA ĐỌC ---
                // Đếm những tin nhắn mà: (Người gửi KHÔNG PHẢI LÀ TÔI) VÀ (Chưa đọc: IsRead = false)
                var unreadCount = conv.Messages.Count(m => m.SenderId != currentUserId && !m.IsRead);

                dtos.Add(new ConversationDto
                {
                    Id = conv.Id,
                    OtherParticipantId = otherParticipant.Id,
                    OtherParticipantFullName = otherParticipant.FullName,
                    // Lấy Headline từ Seeker nếu có, nếu không thì là "Thành viên"
                    OtherParticipantHeadline = otherParticipant.Seeker?.Headline ?? "Thành viên",

                    LastMessage = lastMessage?.Content ?? "Chưa có tin nhắn",
                    LastMessageDate = lastMessage?.SentDate ?? conv.CreatedDate,

                    // Tin nhắn đã được đọc nếu: (không có tin) HOẶC (tin đó là của mình gửi) HOẶC (tin đó đã được đánh dấu đọc)
                    IsRead = (lastMessage == null) || (lastMessage.SenderId == currentUserId) || (lastMessage.IsRead),

                    // --- Gán số lượng tin chưa đọc vào DTO ---
                    UnreadCount = unreadCount
                });
            }
            return dtos;
        }
        // --- API 3: LẤY LỊCH SỬ TIN NHẮN ---
        // --- HÀM LẤY LỊCH SỬ TIN NHẮN ---
        public async Task<IEnumerable<MessageDto>> GetMessagesAsync(int conversationId, int currentUserId)
        {
            // 1. Kiểm tra xem mình có "chìa khóa" (quyền) vào phòng này không
            var hasAccess = await _context.ConversationUsers
                .AnyAsync(cu => cu.ConversationId == conversationId && cu.UserId == currentUserId);

            if (!hasAccess)
            {
                return null; // Trả về null để Controller báo lỗi 403 Forbidden
            }

            // 2. Lấy tin nhắn
            var messages = await _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .Include(m => m.Sender)
                .OrderBy(m => m.SentDate)
                .ToListAsync();

            // (Phần đánh dấu đã đọc chúng ta đã bỏ qua để dùng SignalR)

            // 3. Map sang DTO (CẬP NHẬT PHẦN NÀY)
            return messages.Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content,

                // --- THÊM DÒNG NÀY ---
                Type = m.Type.ToString(), // Chuyển Enum thành chuỗi ("Text", "SharePost", "Image")
                                          // --- KẾT THÚC THÊM ---

                SentDate = m.SentDate,
                IsRead = m.IsRead,
                SenderId = m.SenderId,
                SenderFullName = m.Sender.FullName
            });
        }

        // --- HÀM LẤY MEDIA (ẢNH, FILE, LINK) ---
        public async Task<IEnumerable<MessageDto>> GetConversationMediaAsync(int conversationId, int currentUserId, string? typeFilter)
        {
            // 1. Kiểm tra quyền truy cập (User có trong phòng chat này không?)
            var hasAccess = await _context.ConversationUsers
                .AnyAsync(cu => cu.ConversationId == conversationId && cu.UserId == currentUserId);

            if (!hasAccess)
            {
                return null; // Trả về null -> Controller báo 403
            }

            // 2. Bắt đầu truy vấn
            var query = _context.Messages
                .Where(m => m.ConversationId == conversationId)
                .Include(m => m.Sender) // Lấy thông tin người gửi
                .AsQueryable();

            // 3. Xử lý bộ lọc
            if (!string.IsNullOrEmpty(typeFilter) && Enum.TryParse<MessageType>(typeFilter, true, out var specificType))
            {
                // Nếu user muốn lọc cụ thể (ví dụ: chỉ xem "Image")
                query = query.Where(m => m.Type == specificType);
            }
            else
            {
                // Mặc định: Lấy TẤT CẢ ngoại trừ "Text"
                query = query.Where(m => m.Type != MessageType.Text);
            }

            // 4. Lấy dữ liệu (Mới nhất lên đầu)
            var messages = await query
                .OrderByDescending(m => m.SentDate)
                .ToListAsync();

            // 5. Map sang DTO
            return messages.Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content, // Đây sẽ là URL ảnh/file hoặc ID bài viết
                Type = m.Type.ToString(),
                SentDate = m.SentDate,
                IsRead = m.IsRead,
                SenderId = m.SenderId,
                SenderFullName = m.Sender.FullName
            });
        }
    }
}