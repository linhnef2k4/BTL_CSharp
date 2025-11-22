namespace Freelancer.DTOs
{
    // DTO này dùng để hiển thị thông tin Job (cho Admin hoặc trang "Tìm việc")
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Location { get; set; }
        public decimal MinSalary { get; set; }
        public decimal MaxSalary { get; set; }
        public string WorkType { get; set; }
        public string Level { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; } // "Pending", "Approved"

        // Thông tin nhà tuyển dụng
        public int EmployerId { get; set; }
        public string CompanyName { get; set; }
        public string LogoCompany { get; set; }
    }
}