using System;
using System.Collections.Generic; // <-- Thêm
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public class SocialPostComment
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // --- Liên kết tới người bình luận ---
        [Required]
        public int AuthorId { get; set; }
        [ForeignKey("AuthorId")]
        public virtual User Author { get; set; }

        // --- Liên kết tới bài post ---
        [Required]
        public int PostId { get; set; }
        [ForeignKey("PostId")]
        public virtual SocialPost Post { get; set; }

        // --- NÂNG CẤP "TRẢ LỜI" ---

        // 1. Con trỏ (ID) tới "Comment cha"
        //    (Nếu là comment gốc, cái này sẽ là NULL)
        public int? ParentCommentId { get; set; }

        [ForeignKey("ParentCommentId")]
        public virtual SocialPostComment ParentComment { get; set; }

        // 2. Danh sách các "Comment con" (Các trả lời)
        public virtual ICollection<SocialPostComment> Replies { get; set; }
    }
}