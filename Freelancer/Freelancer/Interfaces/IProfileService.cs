using Freelancer.DTOs;

namespace Freelancer.Interfaces
{
    public interface IProfileService
    {
        Task<UserProfileDto> GetProfileAsync(int userId);
        Task<bool> UpdateProfileAsync(int userId, UpdateProfileRequestDto request);
        Task<bool> RequestEmployerRoleAsync(int userId, EmployerRequestDto request);

        Task<UserProfileDto> GetUserProfileByIdAsync(int userId);
    }
}