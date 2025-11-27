using System;

namespace Freelancer.DTOs
{
    public class ReportDto
    {
        public int Id { get; set; }
        public string ReportType { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string? AttachmentUrl { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; } // "Pending", "Resolved"...
        public string? AdminResponse { get; set; }

        // Thông tin người báo cáo (Cho Admin xem)
        public int ReporterId { get; set; }
        public string ReporterName { get; set; }
        public string ReporterEmail { get; set; }
        public string ReporterPhoneNumber { get; set; }
    }
}