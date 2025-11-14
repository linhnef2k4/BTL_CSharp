using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public class Message
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; } // Nội dung tin nhắn
        public DateTime SentDate { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;

        // --- Ai là người gửi? ---
        [Required]
        public int SenderId { get; set; } // FK tới User
        [ForeignKey("SenderId")]
        public virtual User Sender { get; set; }

        // --- Thuộc cuộc trò chuyện nào? ---
        [Required]
        public int ConversationId { get; set; } // FK tới Conversation
        [ForeignKey("ConversationId")]
        public virtual Conversation Conversation { get; set; }
    }
}