using Freelancer.DTOs;

namespace Freelancer.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterRequestDto registerRequest);
        Task<AuthResponseDto?> LoginAsync(LoginRequestDto loginRequest);
    }
}