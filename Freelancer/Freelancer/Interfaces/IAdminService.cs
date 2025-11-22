using Freelancer.DTOs;

namespace Freelancer.Interfaces
{
    public interface IAdminService
    {
        Task<bool> ApproveProjectAsync(int projectId);
        Task<bool> RejectProjectAsync(int projectId);

        Task<IEnumerable<EmployerProfileDto>> GetPendingEmployerRequestsAsync(string? searchTerm);
        Task<bool> ApproveEmployerRequestAsync(int employerUserId);
        Task<bool> RejectEmployerRequestAsync(int employerUserId);

        Task<IEnumerable<UserProfileDto>> GetAllUsersAsync(string? searchTerm, string? roleFilter , bool? trangThai);
        Task<UserProfileDto> GetUserDetailAsync(int userId);
        Task<bool> ToggleUserLockAsync(int userId); // Khóa hoặc Mở khóa
        Task<bool> ResetUserPasswordAsync(int userId, string newDefaultPassword);
    }
}