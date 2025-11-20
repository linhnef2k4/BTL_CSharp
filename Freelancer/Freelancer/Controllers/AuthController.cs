using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // Hàm helper lấy ID (nếu chưa có thì thêm vào)
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto registerRequest)
        {
            var result = await _authService.RegisterAsync(registerRequest);

            if (!result)
            {
                return BadRequest("Email đã tồn tại hoặc đăng ký thất bại.");
            }

            return Ok("Đăng ký thành công!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto loginRequest)
        {
            var authResponse = await _authService.LoginAsync(loginRequest);

            if (authResponse == null)
            {
                return Unauthorized("Email hoặc mật khẩu không đúng."); // 401
            }

            return Ok(authResponse); // Trả về Token và thông tin user
        }

        // --- API ĐỔI MẬT KHẨU ---
        [HttpPost("change-password")] // POST /api/auth/change-password
        [Authorize] // Bắt buộc phải đăng nhập mới đổi được pass
        public async Task<IActionResult> ChangePassword(ChangePasswordDto request)
        {
            var userId = GetUserIdFromToken();
            var error = await _authService.ChangePasswordAsync(userId, request);

            if (error != null)
            {
                return BadRequest(error); // Trả về lỗi (vd: "Mật khẩu cũ không đúng")
            }

            return Ok("Đổi mật khẩu thành công.");
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto request)
        {
            var result = await _authService.ForgotPasswordAsync(request.Email);

            // Luôn trả về thông báo thành công (để bảo mật)
            return Ok("Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu vào hộp thư của bạn.");
        }
    }
}