using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    // DTO này dùng để nhận dữ liệu khi Seeker yêu cầu làm Employer
    public class EmployerRequestDto
    {
        [Required(ErrorMessage = "Tên công ty là bắt buộc")]
        public string CompanyName { get; set; }

        [Required(ErrorMessage = "Mã số thuế là bắt buộc")]
        public string TaxCode { get; set; } // Mã số thuế

        public string CompanySize { get; set; } // Quy mô (ví dụ: 100-500)
        public string CompanyWebsite { get; set; } // Website
        public string Address { get; set; } // Địa chỉ công ty
    }
}