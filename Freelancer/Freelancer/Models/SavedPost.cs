using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public class SavedPost
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; } // Ai là người lưu
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [Required]
        public int PostId { get; set; } // Bài viết nào được lưu
        [ForeignKey("PostId")]
        public virtual SocialPost Post { get; set; }

        public DateTime SavedDate { get; set; } = DateTime.UtcNow;
    }
}