using System;
using System.Collections.Generic;

namespace Freelancer.Models
{
    public class Conversation
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Một cuộc trò chuyện có 2 người tham gia
        // Chúng ta sẽ dùng 1 Bảng nối (ConversationUser)
        public virtual ICollection<ConversationUser> Participants { get; set; }
        public virtual ICollection<Message> Messages { get; set; }
    }
}