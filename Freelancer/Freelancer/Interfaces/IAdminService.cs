using Freelancer.DTOs;

namespace Freelancer.Interfaces
{
    public interface IAdminService
    {
        Task<bool> ApproveProjectAsync(int projectId);
        Task<bool> RejectProjectAsync(int projectId);

        Task<IEnumerable<EmployerProfileDto>> GetPendingEmployerRequestsAsync();
        Task<bool> ApproveEmployerRequestAsync(int employerUserId);
        Task<bool> RejectEmployerRequestAsync(int employerUserId);
    }
}