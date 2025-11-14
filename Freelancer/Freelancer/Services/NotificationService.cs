using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.AspNetCore.SignalR; // <-- 1. THÊM USING SIGNALR
using Freelancer.Hubs; // <-- 2. THÊM USING HUBS
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Freelancer.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;
        // 3. "TIÊM" (INJECT) HUB VÀO
        private readonly IHubContext<ChatHub> _hubContext;

        // 4. SỬA CONSTRUCTOR
        public NotificationService(ApplicationDbContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext; // <-- Gán
        }

        // --- HÀM 1: ĐỂ ĐỌC (API "CÁI CHUÔNG") ---
        // (Hàm này giữ nguyên, không thay đổi)
        public async Task<IEnumerable<NotificationDto>> GetMyNotificationsAsync(int currentUserId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.RecipientId == currentUserId)
                .Include(n => n.Actor)
                .OrderByDescending(n => n.CreatedDate)
                .Take(20)
                .ToListAsync();

            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                // Ghép tên + message
                Message = (n.Actor?.FullName ?? "Hệ thống") + " " + n.Message,
                LinkUrl = n.LinkUrl,
                IsRead = n.IsRead,
                CreatedDate = n.CreatedDate,
                ActorId = n.ActorId,
                ActorFullName = n.Actor?.FullName
            });
        }

        // --- HÀM 2: ĐỂ TẠO (ĐÃ NÂNG CẤP) ---
        public async Task CreateNotificationAsync(int recipientId, int? actorId, string message, string linkUrl)
        {
            // Không tự thông báo cho chính mình
            if (recipientId == actorId)
            {
                return;
            }

            var notification = new Notification
            {
                RecipientId = recipientId,
                ActorId = actorId,
                Message = message, // (Chỉ lưu message gốc, vd: "đã bình luận...")
                LinkUrl = linkUrl,
                IsRead = false
            };

            // 5. LƯU VÀO DB
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // --- (PHẦN NÂNG CẤP) ĐẨY (PUSH) REAL-TIME ---
            try
            {
                // 6. Lấy thông tin Actor (người gây ra)
                var actor = (actorId.HasValue)
                    ? await _context.Users.FindAsync(actorId.Value)
                    : null;

                // 7. Tạo DTO để "đẩy" đi
                var notificationDto = new NotificationDto
                {
                    Id = notification.Id,
                    // Ghép tên + message (Giống hàm Get)
                    Message = (actor?.FullName ?? "Hệ thống") + " " + notification.Message,
                    LinkUrl = notification.LinkUrl,
                    IsRead = notification.IsRead,
                    CreatedDate = notification.CreatedDate,
                    ActorId = actor?.Id,
                    ActorFullName = actor?.FullName
                };

                // 8. Đẩy (Push) đến Nhóm (Group) của người nhận
                // (ChatHub đã thêm user vào Group có tên = ID của họ)
                string recipientGroup = recipientId.ToString();

                await _hubContext.Clients.Group(recipientGroup)
                                 .SendAsync("ReceiveNotification", notificationDto);
            }
            catch (System.Exception) { /* Lỗi push SignalR (không làm hỏng flow) */ }
            // --- (KẾT THÚC NÂNG CẤP) ---
        }
    }
}