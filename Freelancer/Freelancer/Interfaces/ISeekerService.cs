using Freelancer.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Freelancer.Interfaces
{
    public interface ISeekerService
    {
        Task<IEnumerable<SeekerSearchResultDto>> SearchSeekersAsync(SeekerSearchQueryDto query);
        // Lấy ứng viên phù hợp cho một Job cụ thể (Chỉ dành cho VIP)
        Task<IEnumerable<SeekerSearchResultDto>> GetRecommendedCandidatesAsync(int employerId, int jobId);
    }
}