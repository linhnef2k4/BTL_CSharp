namespace Freelancer.DTOs
{
    // DTO cho biểu đồ doanh thu
    public class RevenueChartDto
    {
        public string Month { get; set; } // Ví dụ: "Tháng 1", "Tháng 2"
        public decimal Revenue { get; set; } // Tổng tiền
    }
}