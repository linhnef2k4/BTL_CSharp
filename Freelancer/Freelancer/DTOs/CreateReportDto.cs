using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    public class CreateReportDto
    {
        [Required(ErrorMessage = "Vui lòng chọn loại báo cáo")]
        public string ReportType { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập tiêu đề")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập nội dung chi tiết")]
        public string Description { get; set; }

        public string? AttachmentUrl { get; set; } // Link ảnh lỗi (nếu có)
    }
}