using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    }
}