using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    // DTO này nhận dữ liệu khi Employer tạo job
    public class CreateProjectDto
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; } // "Chức danh tuyển dụng"

        [Required]
        public string Description { get; set; } // "Mô tả công việc"

        [Required]
        public string Requirements { get; set; } // "Yêu cầu ứng viên"

        [Required]
        public string Benefits { get; set; } // "Quyền lợi"

        [Required]
        public string Location { get; set; } // "Địa điểm làm việc"

        // Lương
        public decimal MinSalary { get; set; }
        public decimal MaxSalary { get; set; }

        [Required]
        public string WorkType { get; set; } // "Hình thức" (Full-time)

        [Required]
        public string Level { get; set; } // "Cấp bậc" (Junior)
    }
}