using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Mvc;

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
    }
}