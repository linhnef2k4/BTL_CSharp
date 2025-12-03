namespace Freelancer.DTOs
{
    public class SupportTicketDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string AttachmentUrl { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public DateTime CreatedDate { get; set; }

        // Thông tin người gửi (để Admin biết ai đang kêu cứu)
        public int SenderId { get; set; }
        public string SenderName { get; set; }
        public string SenderEmail { get; set; }
        public string SenderAvatar { get; set; }
    }
}
