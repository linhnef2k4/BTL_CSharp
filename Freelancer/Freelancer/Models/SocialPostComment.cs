using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public class SocialPostComment
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } // Nội dung bình luận

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // --- Liên kết tới người bình luận ---
        [Required]
        public int AuthorId { get; set; } // FK tới User

        [ForeignKey("AuthorId")]
        public virtual User Author { get; set; }

        // --- Liên kết tới bài post ---
        [Required]
        public int PostId { get; set; } // FK tới SocialPost

        [ForeignKey("PostId")]
        public virtual SocialPost Post { get; set; }
    }
}