namespace Freelancer.DTOs
{
    // DTO chứa các số liệu tổng quan cho Dashboard
    public class AdminDashboardDto
    {
        // Thẻ 1: Tổng User
        public int TotalUsers { get; set; }
        public int TotalSeekers { get; set; }
        public int TotalEmployers { get; set; }

        // Thẻ 2: Tổng Job
        public int TotalJobs { get; set; }
        public int ActiveJobs { get; set; } // Job đang tuyển (Approved)

        // Thẻ 3: Tổng Đơn ứng tuyển
        public int TotalApplications { get; set; }

        // Thẻ 4: Tổng Doanh thu
        public decimal TotalRevenue { get; set; }
    }
}