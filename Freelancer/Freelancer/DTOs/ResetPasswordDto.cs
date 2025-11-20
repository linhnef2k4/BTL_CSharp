using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    public class ResetPasswordDto
    {
        [Required]
        public string Token { get; set; } // Mã token nhận được

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword")]
        public string ConfirmNewPassword { get; set; }
    }
}