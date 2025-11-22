using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Services;
using Microsoft.AspNetCore.Authorization; // <-- Quan trọng!
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims; // <-- Quan trọng!

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // <-- CHÌA KHÓA: Bắt buộc phải đăng nhập (gửi Token) mới gọi được
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        // Hàm helper để lấy UserId từ Token
        private int GetUserIdFromToken()
        {
            // Token chứa claims, chúng ta lấy claim "sub" (Subject) mà ta đã lưu Id
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            // Ép kiểu từ string (trong token) sang int (Id)
            return int.Parse(userIdClaim.Value);
        }

        [HttpGet("me")] // -> /api/profile/me
        public async Task<IActionResult> GetMyProfile()
        {
            // 1. Lấy Id của user đang gọi API (từ token)
            var userId = GetUserIdFromToken();

            // 2. Gọi service để lấy dữ liệu
            var profile = await _profileService.GetProfileAsync(userId);

            if (profile == null)
            {
                return NotFound();
            }

            // 3. Trả về dữ liệu
            return Ok(profile);
        }

        // (Bạn sẽ thêm hàm Update [HttpPut] và RequestEmployer [HttpPost] ở đây sau)
        // ... (Trong tệp Controllers/ProfileController.cs)
        // ... (Giữ nguyên hàm GetUserIdFromToken và GetMyProfile)

        // --- THÊM ENDPOINT MỚI NÀY VÀO ---
        [HttpPut("me")] // Dùng [HttpPut] để CẬP NHẬT
        public async Task<IActionResult> UpdateMyProfile(UpdateProfileRequestDto request)
        {
            var userId = GetUserIdFromToken();
            var result = await _profileService.UpdateProfileAsync(userId, request);

            if (!result)
            {
                return BadRequest("Cập nhật thông tin thất bại.");
            }

            return Ok("Cập nhật thông tin thành công.");
        }

        [HttpPost("request-employer")]
        public async Task<IActionResult> RequestEmployerRole(EmployerRequestDto request)
        {
            var userId = GetUserIdFromToken();
            var result = await _profileService.RequestEmployerRoleAsync(userId, request);

            if (!result)
            {
                // Lý do duy nhất hàm trả về false là user đã có hồ sơ Employer
                return BadRequest("Bạn đã gửi yêu cầu hoặc đã có hồ sơ nhà tuyển dụng.");
            }

            return Ok("Yêu cầu đã được gửi. Vui lòng chờ Admin duyệt.");
        }

        [HttpGet("{userId}")] // Route: GET /api/profile/123
        [AllowAnonymous] // Cho phép xem công khai (hoặc bỏ dòng này nếu bắt buộc đăng nhập)
        public async Task<IActionResult> GetUserProfile(int userId)
        {
            var profile = await _profileService.GetUserProfileByIdAsync(userId);

            if (profile == null)
            {
                return NotFound("Không tìm thấy hồ sơ người dùng.");
            }

            return Ok(profile);
        }


        // Lấy 1 Seeker VIP
        [HttpGet("seeker/vip")]
        public async Task<IActionResult> GetVipSeeker()
        {
            var result = await _profileService.GetVipSeekerAsync();
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        // Lấy 1 Employer VIP
        [HttpGet("employer/vip")]
        public async Task<IActionResult> GetVipEmployer()
        {
            var result = await _profileService.GetVipEmployerAsync();
            if (result == null)
                return NotFound();
            return Ok(result);
        }
    }
}