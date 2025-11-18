using Freelancer.Models; // <-- Cần để dùng Enum ProjectStatus
using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    public class UpdateProjectDto
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Requirements { get; set; }

        [Required]
        public string Benefits { get; set; }

        [Required]
        public string Location { get; set; }

        public decimal MinSalary { get; set; }
        public decimal MaxSalary { get; set; }

        [Required]
        public string WorkType { get; set; }

        [Required]
        public string Level { get; set; }

        // --- THÊM TRƯỜNG NÀY ---
        // Cho phép Employer cập nhật trạng thái (ví dụ: chuyển sang "Closed")
        public ProjectStatus? Status { get; set; }
        // --- KẾT THÚC ---
    }
}