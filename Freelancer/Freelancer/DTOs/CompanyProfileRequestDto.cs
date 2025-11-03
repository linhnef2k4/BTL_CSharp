
using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    public class CompanyProfileRequestDto
    {
        [Required]
        public string CompanyName { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? LogoUrl { get; set; }
    }
}