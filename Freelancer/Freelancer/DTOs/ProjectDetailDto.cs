namespace Freelancer.DTOs
{
    // DTO này chứa TOÀN BỘ thông tin của 1 job
    public class ProjectDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; }

        // --- Các trường chi tiết ---
        public string Description { get; set; }
        public string Requirements { get; set; }
        public string Benefits { get; set; }
        // --- (Kết thúc) ---

        public string Location { get; set; }
        public decimal MinSalary { get; set; }
        public decimal MaxSalary { get; set; }
        public string WorkType { get; set; }
        public string Level { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; }

        // Thông tin nhà tuyển dụng (giữ nguyên)
        public int EmployerId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyWebsite { get; set; }
        public string CompanySize { get; set; }
        public string CompanyAddress { get; set; }
    }
}