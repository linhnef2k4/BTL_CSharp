using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Bắt buộc đăng nhập
    public class ConversationsController : ControllerBase
    {
        private readonly IConversationService _conversationService;

        public ConversationsController(IConversationService conversationService)
        {
            _conversationService = conversationService;
        }

        // Hàm helper
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }

        // API 1: Bắt đầu chat (khi bấm nút "Nhắn tin")
        // (Chúng ta truyền ID người nhận qua URL)
        [HttpPost("{recipientUserId}")]
        public async Task<IActionResult> StartConversation(int recipientUserId)
        {
            var currentUserId = GetUserIdFromToken();
            try
            {
                var conversationId = await _conversationService.StartConversationAsync(currentUserId, recipientUserId);
                // Trả về ID phòng chat (frontend sẽ dùng ID này để chuyển trang)
                return Ok(new { ConversationId = conversationId });
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // API 2: Lấy "Hộp thư" (danh sách chat)
        [HttpGet]
        public async Task<IActionResult> GetMyConversations()
        {
            var currentUserId = GetUserIdFromToken();
            var conversations = await _conversationService.GetMyConversationsAsync(currentUserId);
            return Ok(conversations);
        }

        // API 3: Lấy lịch sử tin nhắn
        [HttpGet("{conversationId}/messages")]
        public async Task<IActionResult> GetMessages(int conversationId)
        {
            var currentUserId = GetUserIdFromToken();
            var messages = await _conversationService.GetMessagesAsync(conversationId, currentUserId);

            if (messages == null)
            {
                return Forbid("Bạn không có quyền xem cuộc trò chuyện này.");
            }
            return Ok(messages);
        }

        [HttpGet("{conversationId}/media")]
        public async Task<IActionResult> GetConversationMedia(int conversationId, [FromQuery] string? type)
        {
            var currentUserId = GetUserIdFromToken();
            var mediaFiles = await _conversationService.GetConversationMediaAsync(conversationId, currentUserId, type);

            if (mediaFiles == null)
            {
                return Forbid("Bạn không có quyền xem cuộc trò chuyện này.");
            }

            return Ok(mediaFiles);
        }
    }
}