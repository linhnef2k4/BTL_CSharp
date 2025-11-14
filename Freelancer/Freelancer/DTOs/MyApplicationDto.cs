using System;

namespace Freelancer.DTOs
{
    // DTO này dùng để Seeker xem "Lịch sử ứng tuyển"
    public class MyApplicationDto
    {
        public int ApplicationId { get; set; } // ID của đơn ứng tuyển
        public int ProjectId { get; set; } // ID của Job

        // Thông tin Job đã ứng tuyển
        public string ProjectTitle { get; set; }
        public string CompanyName { get; set; }

        // Trạng thái đơn
        public DateTime AppliedDate { get; set; } // Ngày nộp
        public string Status { get; set; } // "Pending", "Viewed", "Accepted"...
    }
}