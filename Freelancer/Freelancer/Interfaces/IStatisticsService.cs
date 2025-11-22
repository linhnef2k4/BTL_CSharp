using Freelancer.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Freelancer.Interfaces
{
    public interface IStatisticsService
    {
        // Lấy số liệu tổng quan
        Task<AdminDashboardDto> GetAdminDashboardAsync();

        // Lấy dữ liệu biểu đồ doanh thu (theo năm)
        Task<IEnumerable<RevenueChartDto>> GetYearlyRevenueAsync(int year);

        // (Optional) Lấy danh sách dự án mới nhất
        Task<IEnumerable<ProjectDto>> GetRecentProjectsAsync();
        // Lấy danh sách hoạt động gần đây (User mới, Job mới, Payment mới...)
        Task<IEnumerable<RecentActivityDto>> GetRecentActivitiesAsync();
    }
}