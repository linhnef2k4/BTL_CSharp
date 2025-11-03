using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Freelancer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        // "Tiêm" Service vào
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // Tạo endpoint: POST api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(dto);

            if (!result.Succeeded)
            {
                // Nếu thất bại (VD: Email trùng), trả về lỗi
                return BadRequest(result.Errors);
            }

            // Nếu thành công
            return Ok(new { Message = "Đăng ký thành công!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var loginResponse = await _authService.LoginAsync(dto);

            if (loginResponse == null)
            {
                // Nếu Service trả về null, nghĩa là sai Email hoặc Password
                return Unauthorized(new { Message = "Email hoặc mật khẩu không đúng." });
            }

            // Đăng nhập thành công, trả về Token
            return Ok(loginResponse);
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequestDto dto)
        {
            var loginResponse = await _authService.GoogleLoginAsync(dto);

            if (loginResponse == null)
            {
                return Unauthorized(new { Message = "Đăng nhập Google thất bại." });
            }

            // Đăng nhập thành công, trả về Token CỦA MÌNH
            return Ok(loginResponse);
        }
    }
}