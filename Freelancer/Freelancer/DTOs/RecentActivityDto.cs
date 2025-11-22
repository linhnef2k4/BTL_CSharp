using System;

namespace Freelancer.DTOs
{
    public class RecentActivityDto
    {
        public string Type { get; set; } // "User", "Job", "Payment"
        public string Description { get; set; } // "Nguyễn Văn A đã đăng ký", "Job X vừa được đăng"...
        public DateTime Time { get; set; }
        public string? LinkUrl { get; set; } // Link để Admin bấm vào xem chi tiết

        // (Để hiển thị icon/avatar nếu cần)
        public string? ImageUrl { get; set; }
    }
}