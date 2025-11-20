namespace Freelancer.DTOs
{
    // DTO này hiển thị 1 cuộc trò chuyện trong "Hộp thư"
    public class ConversationDto
    {
        public int Id { get; set; } // ID của cuộc trò chuyện

        // --- Thông tin VỀ NGƯỜI KIA ---
        // (Không phải thông tin của mình)
        public int OtherParticipantId { get; set; }
        public string OtherParticipantFullName { get; set; }
        public string OtherParticipantHeadline { get; set; } // "Frontend Developer"

        // --- Tin nhắn cuối cùng ---
        public string LastMessage { get; set; }
        public DateTime LastMessageDate { get; set; }
        public bool IsRead { get; set; } // Tin nhắn cuối cùng đã đọc chưa
        public int UnreadCount { get; set; }
    }
}