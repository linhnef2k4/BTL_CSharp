using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    // Enum trạng thái của đơn ứng tuyển
    public enum ApplicationStatus
    {
        Pending,  // Mới nộp, nhà tuyển dụng chưa xem
        Viewed,   // Nhà tuyển dụng đã xem
        Accepted, // Chấp nhận
        Rejected  // Từ chối
    }

    public class JobApplication
    {
        public int Id { get; set; }

        // --- THÔNG TIN CHÍNH MÀ USER GỬI LÊN ---
        [Required]
        public string CoverLetter { get; set; } // Thư xin việc / Lời nhắn

        [Required]
        public string CvUrl { get; set; } // Link tới file CV (Google Drive, v.v.)
        // (Lưu ý: Chúng ta lưu URL, không lưu file trực tiếp vào DB)

        // --- CÁC KHÓA NGOẠI ---
        [Required]
        public int ProjectId { get; set; } // Ứng tuyển Job nào

        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; }

        [Required]
        public int SeekerId { get; set; } // Ai là người ứng tuyển (chính là UserId)

        [ForeignKey("SeekerId")]
        public virtual Seeker Seeker { get; set; } // Hoặc "User" nếu bạn muốn

        // --- THÔNG TIN HỆ THỐNG ---
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

        [Required]
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
    }
}