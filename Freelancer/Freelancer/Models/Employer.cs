using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public enum EmployerStatus
    {
        Pending,  // Mới yêu cầu, chờ duyệt
        Approved, // Đã duyệt, được đăng tuyển
        Rejected  // Bị từ chối
    }
    public class Employer
    {
        [Key]
        [ForeignKey("User")]
        public int Id { get; set; } // Sẽ BẰNG với User.Id

        // 1. Tên công ty
        [Required]
        [StringLength(255)]
        public string CompanyName { get; set; }

        // 2. Mã thuế
        [StringLength(50)]
        public string? TaxCode { get; set; }

        // 3. Quy mô công ty (ví dụ: "10-50", "50-100", "Trên 1000")
        [StringLength(100)]
        public string? CompanySize { get; set; }

        // 4. Website công ty
        [Url] // Đảm bảo đây là một URL hợp lệ (nếu được nhập)
        [StringLength(255)]
        public string? CompanyWebsite { get; set; }

        // 5. Trụ sở chính (dùng lại thuộc tính Address đã có)
        public string? Address { get; set; }

        // 6. Có phải tài khoản VIP
        public bool IsVip { get; set; } = false; // Mặc định là tài khoản thường

        // --- Thuộc tính khác đã có ---
        public string? CompanyDescription { get; set; }

        // --- Navigation Property ---
        [Required]
        public EmployerStatus Status { get; set; } = EmployerStatus.Pending; // Mặc định là chờ duyệt

        public string? CompanyLogoUrl { get; set; }

        public virtual User User { get; set; }
    }
}