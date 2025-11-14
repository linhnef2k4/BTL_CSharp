namespace Freelancer.DTOs
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime SentDate { get; set; }
        public bool IsRead { get; set; }

        // Thông tin người gửi
        public int SenderId { get; set; }
        public string SenderFullName { get; set; }
    }
}