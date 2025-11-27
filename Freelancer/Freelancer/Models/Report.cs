using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public enum ReportStatus
    {
        Pending,    // Chờ xử lý
        Resolved,   // Đã giải quyết
        Dismissed   // Bỏ qua (Báo cáo sai)
    }

    public class Report
    {
        public int Id { get; set; }

        // Ai là người báo cáo?
        [Required]
        public int ReporterId { get; set; }
        [ForeignKey("ReporterId")]
        public virtual User Reporter { get; set; }

        // Loại báo cáo (Ví dụ: "Lỗi kỹ thuật", "Lừa đảo", "Spam")
        [Required]
        public string ReportType { get; set; }

        // Tiêu đề báo cáo
        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        // Nội dung chi tiết
        [Required]
        public string Description { get; set; }

        // Ảnh đính kèm (nếu có - minh chứng lỗi)
        public string? AttachmentUrl { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Trạng thái xử lý (Admin update)
        public ReportStatus Status { get; set; } = ReportStatus.Pending;

        // Phản hồi của Admin
        public string? AdminResponse { get; set; }
    }
}