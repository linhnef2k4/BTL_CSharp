using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public class Notification
    {
        public int Id { get; set; }

        // --- Ai sẽ NHẬN thông báo? ---
        [Required]
        public int RecipientId { get; set; }
        [ForeignKey("RecipientId")]
        public virtual User Recipient { get; set; }

        // --- Ai đã GÂY RA thông báo? (Ví dụ: "Minh Tuấn...") ---
        // (Nullable, vì có thể là thông báo hệ thống)
        public int? ActorId { get; set; }
        [ForeignKey("ActorId")]
        public virtual User Actor { get; set; }

        // --- Nội dung ---
        [Required]
        public string Message { get; set; } // Ví dụ: "đã chấp nhận lời mời kết bạn."

        // --- Link khi bấm vào ---
        public string? LinkUrl { get; set; } // Ví dụ: "/profile/123" hoặc "/jobs/45"

        // --- Trạng thái ---
        public bool IsRead { get; set; } = false; // Mặc định là "Chưa đọc"
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}