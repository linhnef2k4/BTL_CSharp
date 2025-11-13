using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public class SocialPostReaction
    {
        public int Id { get; set; }

        [Required]
        public string ReactionType { get; set; } // Ví dụ: "Like", "Love", "Haha"

        // --- Liên kết tới người thả ---
        [Required]
        public int UserId { get; set; } // FK tới User

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        // --- Liên kết tới bài post ---
        [Required]
        public int PostId { get; set; } // FK tới SocialPost

        [ForeignKey("PostId")]
        public virtual SocialPost Post { get; set; }
    }
}