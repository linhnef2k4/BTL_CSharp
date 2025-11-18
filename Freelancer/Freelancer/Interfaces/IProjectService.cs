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
        // 1. Sửa Job (Update)
        Task<string?> UpdateProjectAsync(int projectId, int employerId, UpdateProjectDto request);

        // 2. Xóa mềm Job (Soft Delete)
        Task<string?> SoftDeleteProjectAsync(int projectId, int employerId);

        // 3. Lấy danh sách Job trong thùng rác
        Task<IEnumerable<ProjectDto>> GetMyTrashedProjectsAsync(int employerId);

        // 4. Khôi phục Job
        Task<string?> RestoreProjectAsync(int projectId, int employerId);

        // 5. Xóa vĩnh viễn Job
        Task<string?> DeleteProjectPermanentAsync(int projectId, int employerId);
    }
}