using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/friends")]
    [Authorize] // Bắt buộc đăng nhập
    public class FriendshipsController : ControllerBase
    {
        private readonly IFriendshipService _friendshipService;

        public FriendshipsController(IFriendshipService friendshipService)
        {
            _friendshipService = friendshipService;
        }

        // Hàm helper (copy từ controller khác)
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }

        // --- API 1: GỬI YÊU CẦU ---
        [HttpPost("send-request/{receiverId}")]
        public async Task<IActionResult> SendFriendRequest(int receiverId)
        {
            var currentUserId = GetUserIdFromToken();
            var error = await _friendshipService.SendFriendRequestAsync(currentUserId, receiverId);
            if (error != null)
            {
                return BadRequest(error);
            }
            return Ok("Gửi yêu cầu kết bạn thành công.");
        }

        // --- API 2: LẤY DANH SÁCH YÊU CẦU ĐANG CHỜ ---
        [HttpGet("pending-requests")]
        public async Task<IActionResult> GetPendingRequests()
        {
            var currentUserId = GetUserIdFromToken();
            var requests = await _friendshipService.GetPendingRequestsAsync(currentUserId);
            return Ok(requests);
        }

        // --- API 3: CHẤP NHẬN YÊU CẦU ---
        [HttpPost("accept-request/{friendshipId}")]
        public async Task<IActionResult> AcceptRequest(int friendshipId)
        {
            var currentUserId = GetUserIdFromToken();
            var success = await _friendshipService.AcceptFriendRequestAsync(friendshipId, currentUserId);
            if (!success)
            {
                return NotFound("Không tìm thấy yêu cầu hoặc bạn không có quyền.");
            }
            return Ok("Kết bạn thành công.");
        }

        // --- API 4: TỪ CHỐI YÊU CẦU ---
        [HttpPost("reject-request/{friendshipId}")]
        public async Task<IActionResult> RejectRequest(int friendshipId)
        {
            var currentUserId = GetUserIdFromToken();
            var success = await _friendshipService.RejectFriendRequestAsync(friendshipId, currentUserId);
            if (!success)
            {
                return NotFound("Không tìm thấy yêu cầu hoặc bạn không có quyền.");
            }
            return Ok("Từ chối yêu cầu thành công.");
        }

        // --- API 5: LẤY DANH SÁCH BẠN BÈ ---
        [HttpGet] // Route: GET /api/friends
        public async Task<IActionResult> GetMyFriends()
        {
            var currentUserId = GetUserIdFromToken();
            var friends = await _friendshipService.GetFriendsAsync(currentUserId);
            return Ok(friends);
        }
    }
}