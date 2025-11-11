using System.ComponentModel.DataAnnotations;

namespace Freelancer.Models
{
    public class User
    {
        public int Id { get; set; }

        // --- THUỘC TÍNH CHUNG ---
        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Phone]
        [StringLength(20)]
        public string? PhoneNumber { get; set; }

        public string? Gender { get; set; }

        public string? Address { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // --- QUẢN LÝ VAI TRÒ ---
        [Required]
        public string Role { get; set; } // Sẽ lưu là "Seeker" hoặc "Employer"
                                         // (Hoặc bạn có thể dùng kiểu Enum UserRole ở trên)

        // --- Navigation Properties (Quan hệ) ---
        // Các thuộc tính này là "optional" (có thể null)
        // Một User có thể là Seeker (và không phải Employer)
        public virtual Seeker Seeker { get; set; }

        // Một User có thể là Employer (và không phải Seeker)
        public virtual Employer Employer { get; set; }
    }
}