using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Phải đăng nhập mới được tìm
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConversationService _conversationService; // Cần để gọi StartConversation

        public UsersController(IUserService userService, IConversationService conversationService)
        {
            _userService = userService;
            _conversationService = conversationService;
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }

        // --- API 1: TÌM KIẾM NGƯỜI DÙNG ---
        // GET /api/users/search?query=Minh
        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string query)
        {
            var currentUserId = GetUserIdFromToken();
            var results = await _userService.SearchUsersAsync(query, currentUserId);
            return Ok(results);
        }

        // --- API 2: BẤM VÀO NGƯỜI DÙNG ĐỂ CHAT ---
        // POST /api/users/123/chat
        [HttpPost("{targetUserId}/chat")]
        public async Task<IActionResult> StartChat(int targetUserId)
        {
            var currentUserId = GetUserIdFromToken();
            try
            {
                // Gọi lại hàm StartConversation mà ta đã viết ở ConversationService
                // Hàm này sẽ: Tìm phòng chat cũ (nếu có) HOẶC Tạo phòng mới
                var conversationId = await _conversationService.StartConversationAsync(currentUserId, targetUserId);

                // Trả về ID phòng chat để frontend chuyển trang
                return Ok(new { ConversationId = conversationId });
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}