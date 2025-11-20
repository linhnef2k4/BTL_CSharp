using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}