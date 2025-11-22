using Freelancer.Models;
namespace Freelancer.DTOs
{
    public class EmployerProfileDto
    {
        public int Id { get; set; } // UserId (Cần cái này để gọi API Approve/Reject)
        public string FullName { get; set; } // Tên người dùng
        public string Email { get; set; }    // Email người dùng

        public string NumberPhone { get; set; }
        public string CompanyName { get; set; }
        public string TaxCode { get; set; }
        public string CompanySize { get; set; }
        public string CompanyWebsite { get; set; }
        public string Address { get; set; }
        public bool IsVip { get; set; }
        public string Status { get; set; } // "Pending", "Approved", "Rejected"
        public string LogoCompany { get; set; }
    }
}