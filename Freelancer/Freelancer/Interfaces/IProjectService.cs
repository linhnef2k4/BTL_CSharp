using Freelancer.DTOs;

namespace Freelancer.Interfaces
{
    public interface IProjectService
    {
        // Trả về string (thông báo lỗi) nếu thất bại, null nếu thành công
        Task<string> CreateProjectAsync(int employerId, CreateProjectDto request);
        Task<IEnumerable<ProjectDto>> GetPendingProjectsAsync();
        Task<IEnumerable<ProjectDto>> GetMyPendingProjectsAsync(int employerId);
        Task<IEnumerable<ProjectDto>> GetApprovedProjectsAsync();
        Task<ProjectDetailDto> GetProjectByIdAsync(int projectId);
    }
}