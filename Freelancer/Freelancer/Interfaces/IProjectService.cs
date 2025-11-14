using Freelancer.DTOs;

namespace Freelancer.Interfaces
{
    public interface IProjectService
    {
        // Trả về string (thông báo lỗi) nếu thất bại, null nếu thành công
        Task<string> CreateProjectAsync(int employerId, CreateProjectDto request);
        Task<IEnumerable<ProjectDto>> GetPendingProjectsAsync();
        Task<IEnumerable<ProjectDto>> GetMyPendingProjectsAsync(int employerId);
        Task<IEnumerable<ProjectDto>> GetApprovedProjectsAsync(JobSearchQueryDto query);
        Task<ProjectDetailDto> GetProjectByIdAsync(int projectId);
        // --- THÊM HÀM MỚI (CHO SEEKER ỨNG TUYỂN) ---
        // (Trả về string nếu có lỗi, null nếu thành công)
        Task<string> ApplyToJobAsync(int projectId, int seekerId, ApplyToJobDto request);
        // --- THÊM HÀM MỚI (EMPLOYER XEM CV) ---
        Task<IEnumerable<JobApplicationDto>> GetJobApplicationsAsync(int projectId, int employerId);
    }
}