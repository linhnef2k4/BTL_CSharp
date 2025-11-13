using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    // Đây chính là "Model Bài viết" (Bài đăng cá nhân)
    public class SocialPost
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } // Nội dung bài đăng

        public string? ImageUrl { get; set; } // Link ảnh (nếu có)

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // --- LIÊN KẾT TỚI NGƯỜI ĐĂNG ---
        [Required]
        public int AuthorId { get; set; } // Khóa ngoại tới User

        [ForeignKey("AuthorId")]
        public virtual User Author { get; set; }
    }
}