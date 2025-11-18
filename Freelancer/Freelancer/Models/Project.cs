using Freelancer.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    // Enum trạng thái (Giữ nguyên)
    public enum ProjectStatus
    {
        Pending,  // Chờ duyệt
        Approved, // Đã duyệt
        Rejected  // Bị từ chối
    }

    public class Project
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; } // -> "Chức danh tuyển dụng"

        [Required]
        public string Description { get; set; } // -> "Mô tả công việc"

        [Required]
        public string Requirements { get; set; } // -> "Yêu cầu ứng viên"

        [Required]
        public string Benefits { get; set; } // -> "Quyền lợi" (Bạn yêu cầu thêm)

        [Required]
        public string Location { get; set; } // -> "Địa điểm làm việc"

        // Đã thay thế "Budget" bằng 2 trường này
        public decimal MinSalary { get; set; } // -> "Lương tối thiểu"
        public decimal MaxSalary { get; set; } // -> "Lương tối đa"

        [Required]
        public string WorkType { get; set; } // -> "Hình thức" (Full-time, Remote...)

        [Required]
        public string Level { get; set; } // -> "Cấp bậc" (Junior, Senior...)

        // Giữ lại các trường hệ thống
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; } // Thời gian sửa lần cuối

        [Required]
        public ProjectStatus Status { get; set; } = ProjectStatus.Pending; // Để Admin duyệt

        // --- Liên kết tới Employer (Rất quan trọng) ---
        [Required]
        public int EmployerId { get; set; } // ID của nhà tuyển dụng đã đăng bài

        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedDate { get; set; }

        [ForeignKey("EmployerId")]
        public virtual Employer Employer { get; set; }
    }
}