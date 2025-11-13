using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    // Model này lưu "Like", "Love"... cho BÌNH LUẬN
    public class SocialCommentReaction
    {
        public int Id { get; set; }

        [Required]
        public string ReactionType { get; set; } // "Like", "Love"...

        // --- Liên kết tới người thả ---
        [Required]
        public int UserId { get; set; } // FK tới User

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        // --- Liên kết tới bình luận ---
        [Required]
        public int CommentId { get; set; } // FK tới SocialPostComment

        [ForeignKey("CommentId")]
        public virtual SocialPostComment Comment { get; set; }
    }
}