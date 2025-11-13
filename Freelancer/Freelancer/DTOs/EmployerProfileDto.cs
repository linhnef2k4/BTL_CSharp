using Freelancer.Models;
namespace Freelancer.DTOs
{
    public class EmployerProfileDto
    {
        public string CompanyName { get; set; }
        public string TaxCode { get; set; }
        public string CompanySize { get; set; }
        public string CompanyWebsite { get; set; }
        public string Address { get; set; }
        public bool IsVip { get; set; }
        public string Status { get; set; } // "Pending", "Approved", "Rejected"
    }
}