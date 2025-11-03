
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public string Salary { get; set; } // Dùng string cho "Thỏa thuận"
        public string Location { get; set; }
        public DateTime PostedAt { get; set; } = DateTime.UtcNow;

        // ----- Khóa ngoại (Quan hệ 1-Nhiều) -----
        // 1 Việc làm thuộc về 1 Công ty
        public int CompanyId { get; set; }

        [ForeignKey("CompanyId")]
        public virtual Company Company { get; set; }
    }
}