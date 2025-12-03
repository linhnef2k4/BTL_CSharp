using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Concurrent; // Cần thêm thư viện này
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freelancer.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;

        // --- PHẦN MỚI: KHO LƯU TRỮ ONLINE (Dùng static để lưu trên RAM) ---
        private static readonly ConcurrentDictionary<int, List<string>> _onlineUsers = new();

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- SỬA HÀM KẾT NỐI: GIỮ CŨ + THÊM MỚI ---
        public override async Task OnConnectedAsync()
        {
            var userIdString = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // 1. LOGIC CŨ CỦA BẠN (GIỮ NGUYÊN)
            // Add user vào Group để frontend chat hoạt động như cũ
            if (!string.IsNullOrEmpty(userIdString))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userIdString);
            }

            // 2. LOGIC MỚI (ONLINE STATUS) - Chèn thêm vào
            if (int.TryParse(userIdString, out int userId))
            {
                _onlineUsers.AddOrUpdate(userId,
                    new List<string> { Context.ConnectionId },
                    (key, list) =>
                    {
                        lock (list)
                        {
                            if (!list.Contains(Context.ConnectionId)) list.Add(Context.ConnectionId);
                        }
                        return list;
                    });

                // Chỉ thông báo nếu đây là tab đầu tiên mở (tránh báo 2 lần)
                if (_onlineUsers.TryGetValue(userId, out var connections))
                {
                    bool isFirstConnection;
                    lock (connections) { isFirstConnection = connections.Count == 1; }

                    if (isFirstConnection)
                    {
                        // Báo cho mọi người: "User này vừa Online"
                        await Clients.Others.SendAsync("UserOnline", userId);
                    }
                }
            }

            await base.OnConnectedAsync();
        }

        // --- SỬA HÀM NGẮT KẾT NỐI: THÊM LOGIC OFFLINE ---
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userIdString = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdString, out int userId))
            {
                // 1. LOGIC CŨ (GIỮ NGUYÊN)
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userIdString);

                // 2. LOGIC MỚI (OFFLINE STATUS)
                if (_onlineUsers.TryGetValue(userId, out var connections))
                {
                    lock (connections)
                    {
                        connections.Remove(Context.ConnectionId);
                    }

                    if (connections.Count == 0)
                    {
                        _onlineUsers.TryRemove(userId, out _);
                        // Báo cho mọi người: "User này Offline rồi"
                        await Clients.Others.SendAsync("UserOffline", userId);
                    }
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        // --- API MỚI: LẤY DANH SÁCH ONLINE (Frontend gọi cái này lúc mới vào) ---
        public Task<IEnumerable<int>> GetOnlineUsers()
        {
            return Task.FromResult(_onlineUsers.Keys.AsEnumerable());
        }

        // ========================================================================
        // TỪ ĐÂY TRỞ XUỐNG LÀ CODE CŨ CỦA BẠN (GIỮ NGUYÊN 100%)
        // ========================================================================

        public async Task SendMessage(int conversationId, string content, string type = "Text")
        {
            // 1. Lấy ID người gửi (từ Token)
            var senderId = int.Parse(Context.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // 2. Kiểm tra xem người gửi có quyền trong phòng này không
            var hasAccess = await _context.ConversationUsers
                .AnyAsync(cu => cu.ConversationId == conversationId && cu.UserId == senderId);

            if (!hasAccess)
            {
                // Ném lỗi về cho người gửi
                await Clients.Caller.SendAsync("ReceiveError", "Bạn không có quyền gửi tin nhắn vào phòng này.");
                return;
            }

            // 3. Parse Enum (Hỗ trợ cả "File")
            if (!Enum.TryParse<MessageType>(type, true, out var messageType))
            {
                messageType = MessageType.Text;
            }

            // 4. Tạo Model Message
            var message = new Message
            {
                ConversationId = conversationId,
                SenderId = senderId,
                Content = content,
                Type = messageType, // <-- Lưu loại tin nhắn
                SentDate = System.DateTime.UtcNow,
                IsRead = false // Mới gửi, chưa đọc
            };

            // 5. Lưu vào Database
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // 6. Chuẩn bị DTO để gửi đi
            var sender = await _context.Users.FindAsync(senderId);
            var messageDto = new MessageDto
            {
                Id = message.Id,
                Content = message.Content,
                Type = message.Type.ToString(), // <-- Trả về loại tin nhắn
                SentDate = message.SentDate,
                IsRead = message.IsRead,
                SenderId = message.SenderId,
                SenderFullName = sender.FullName
            };

            // 7. Gửi tin nhắn đến NHỮNG NGƯỜI KHÁC trong phòng
            var participantIds = await _context.ConversationUsers
                .Where(cu => cu.ConversationId == conversationId)
                .Select(cu => cu.UserId.ToString()) // Phải là string
                .ToListAsync();

            // "Clients.Users(ids)" sẽ gửi đến các user ID cụ thể
            await Clients.Users(participantIds).SendAsync("ReceiveMessage", messageDto);
        }

        public async Task MarkAsRead(int conversationId)
        {
            // 1. Lấy ID người đang xem (từ Token)
            var currentUserId = int.Parse(Context.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // 2. Tìm tất cả tin nhắn CHƯA ĐỌC trong phòng này mà KHÔNG PHẢI do mình gửi
            var unreadMessages = await _context.Messages
                .Where(m => m.ConversationId == conversationId &&
                            m.SenderId != currentUserId &&
                            !m.IsRead)
                .ToListAsync();

            if (!unreadMessages.Any())
            {
                return; // Không có gì để đánh dấu
            }

            // 3. Đánh dấu tất cả là ĐÃ ĐỌC
            foreach (var msg in unreadMessages)
            {
                msg.IsRead = true;
            }

            // 4. Lưu vào Database
            await _context.SaveChangesAsync();

            // 5. Thông báo "real-time" cho người gửi
            var senderIds = unreadMessages
                .Select(m => m.SenderId.ToString())
                .Distinct()
                .ToList();

            await Clients.Users(senderIds).SendAsync("MessagesRead", conversationId, currentUserId);
        }
    }
}