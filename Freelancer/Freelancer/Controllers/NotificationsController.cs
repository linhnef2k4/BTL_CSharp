using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize] // Bắt buộc đăng nhập
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // Hàm helper
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }

        // --- API "CÁI CHUÔNG" ---
        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var currentUserId = GetUserIdFromToken();
            var notifications = await _notificationService.GetMyNotificationsAsync(currentUserId);
            return Ok(notifications);
        }

        // (Sau này chúng ta sẽ làm API "Đánh dấu đã đọc")
        // [HttpPost("mark-as-read")]
        // Đánh dấu 1 thông báo cụ thể là đã đọc

        // --- THÊM API 1: Đánh dấu 1 cái (Khi user bấm vào thông báo) ---
        // PUT: api/notifications/5/read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userId = GetUserIdFromToken();
            await _notificationService.MarkAsReadAsync(id, userId);
            return Ok(new { Message = "Đã đánh dấu đã đọc." });
        }

        // --- THÊM API 2: Đánh dấu tất cả (Nút "Đánh dấu tất cả đã đọc") ---
        // PUT: api/notifications/read-all
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userId = GetUserIdFromToken();
            await _notificationService.MarkAllAsReadAsync(userId);
            return Ok(new { Message = "Đã đánh dấu tất cả là đã đọc." });
        }
    }
}