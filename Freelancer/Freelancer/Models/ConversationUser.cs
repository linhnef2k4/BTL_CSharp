using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    // Bảng nối N-N giữa Conversation và User
    public class ConversationUser
    {
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public int ConversationId { get; set; }
        [ForeignKey("ConversationId")]
        public virtual Conversation Conversation { get; set; }
    }
}