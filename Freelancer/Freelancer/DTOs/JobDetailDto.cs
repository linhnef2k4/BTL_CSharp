// Đặt trong: DTOs/JobDetailDto.cs
namespace Freelancer.DTOs
{
    public class JobDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public string Location { get; set; }
        public string Salary { get; set; }
        public DateTime PostedAt { get; set; }

        // Thông tin công ty đi kèm
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string? CompanyDescription { get; set; }
        public string? CompanyLogoUrl { get; set; }
    }
}