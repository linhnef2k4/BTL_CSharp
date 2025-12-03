using System;
using System.ComponentModel.DataAnnotations;

namespace Freelancer.Models
{
    public class SupportTicket
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; } // Tiêu đề lỗi (VD: Lỗi không đăng được bài)
        public string Description { get; set; } // Mô tả chi tiết
        public string? AttachmentUrl { get; set; } // Ảnh chụp màn hình lỗi (nếu có)

        public string Priority { get; set; } = "Medium"; // Low, Medium, High
        public string Status { get; set; } = "Pending"; // Pending, InProgress, Resolved

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ResolvedDate { get; set; }

        // Người gửi báo cáo
        public int UserId { get; set; }
        public User User { get; set; }
    }
}