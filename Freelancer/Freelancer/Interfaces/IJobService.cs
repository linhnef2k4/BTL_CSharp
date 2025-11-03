
using Freelancer.DTOs;
using System.Security.Claims;

namespace Freelancer.Interfaces
{
    public interface IJobService
    {
        // Trả về Job ID nếu thành công, null nếu thất bại
        Task<int?> CreateJobAsync(JobRequestDto dto, ClaimsPrincipal user);
        Task<PagedResultDto<JobSummaryDto>> SearchJobsAsync(string? searchTerm, string? location, int page, int pageSize);
        Task<JobDetailDto?> GetJobByIdAsync(int id);
        // (Sau này chúng ta sẽ thêm các hàm Get, Update, Delete)
    }
}