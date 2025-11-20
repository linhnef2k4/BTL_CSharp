using Freelancer.DTOs;

namespace Freelancer.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterRequestDto registerRequest);
        Task<AuthResponseDto?> LoginAsync(LoginRequestDto loginRequest);
        Task<string?> ChangePasswordAsync(int userId, ChangePasswordDto request);
        // Trả về Token (để test) hoặc null (nếu lỗi)
        Task<string?> ForgotPasswordAsync(string email);

        
    }
}