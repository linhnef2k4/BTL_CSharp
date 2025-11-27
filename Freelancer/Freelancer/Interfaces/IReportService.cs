using Freelancer.DTOs;
using Freelancer.Models; // Cần cho Enum
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Freelancer.Interfaces
{
    public interface IReportService
    {
        // User gửi báo cáo
        Task<ReportDto> CreateReportAsync(int reporterId, CreateReportDto request);

        // User xem lịch sử báo cáo của mình    
        Task<IEnumerable<ReportDto>> GetMyReportsAsync(int userId);

        // Admin xem tất cả báo cáo (có lọc theo trạng thái)
        Task<IEnumerable<ReportDto>> GetAllReportsAsync(ReportStatus? status);

        // Admin xử lý báo cáo
        Task<bool> RespondToReportAsync(int reportId, ReportStatus status, string response);
    }
}