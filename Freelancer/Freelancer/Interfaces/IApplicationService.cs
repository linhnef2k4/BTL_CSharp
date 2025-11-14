using Freelancer.DTOs;
using Freelancer.Models; // <-- Cần cho ApplicationStatus
using System.Threading.Tasks;

namespace Freelancer.Interfaces
{
    public interface IApplicationService
    {
        // Trả về string (thông báo lỗi) nếu thất bại, null nếu thành công
        Task<string> UpdateApplicationStatusAsync(int applicationId, int employerId, ApplicationStatus newStatus);
        Task<IEnumerable<MyApplicationDto>> GetMyApplicationsAsync(int seekerId);
    }
}