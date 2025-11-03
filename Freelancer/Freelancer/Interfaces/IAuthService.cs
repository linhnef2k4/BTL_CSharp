// Đặt trong: Interfaces/IAuthService.cs
using Freelancer.DTOs;
using Microsoft.AspNetCore.Identity;

namespace Freelancer.Interfaces
{
    public interface IAuthService
    {
        // Nhận vào DTO đăng ký, trả về kết quả (thành công hay lỗi)
        Task<IdentityResult> RegisterAsync(RegisterRequestDto dto);


        Task<LoginResponseDto> LoginAsync(LoginRequestDto dto);

        Task<LoginResponseDto> GoogleLoginAsync(GoogleLoginRequestDto dto);
    }
}