// Đặt trong: DTOs/JobSummaryDto.cs
namespace Freelancer.DTOs
{
    public class JobSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public string Salary { get; set; }
        public string CompanyName { get; set; } // Lấy từ bảng Company
        public DateTime PostedAt { get; set; }
    }
}