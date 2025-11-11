using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public class Seeker
    {
        [Key]
        [ForeignKey("User")]
        public int Id { get; set; } // Bằng với User.Id

        // 1. Vị trí ứng tuyển (ví dụ: "Senior .NET Developer")
        public string? Headline { get; set; }

        // 2. Tài khoản VIP (dùng bool: true = VIP, false = Thường)
        public bool IsVip { get; set; } = false; // Mặc định là tài khoản thường

        // 3. Cấp bậc (ví dụ: "Intern", "Senior")
        public string? Rank { get; set; }

        // 4. CV (link tới file PDF hoặc docx)
        public string? ResumeUrl { get; set; }

        // --- Thuộc tính khác đã có ---
        public int YearsOfExperience { get; set; } = 0;
        public virtual User User { get; set; }
    }
}