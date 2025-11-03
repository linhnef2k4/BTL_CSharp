// Đặt trong: DTOs/RegisterRequestDto.cs
using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    public class RegisterRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        // Thêm một trường để họ chọn vai trò
        [Required]
        public string Role { get; set; } // Sẽ là "Seeker" hoặc "Employer"
    }
}