
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public string? Address { get; set; }

        // ----- Khóa ngoại (Quan hệ 1-Nhiều) -----
        // 1 Công ty thuộc về 1 Người tuyển dụng (User)
        public string EmployerId { get; set; }

        [ForeignKey("EmployerId")]
        public virtual ApplicationUser Employer { get; set; }

        // 1 Công ty có Nhiều việc làm
        public virtual ICollection<Job> Jobs { get; set; }
    }
}