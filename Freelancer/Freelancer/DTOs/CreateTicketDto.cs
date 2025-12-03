namespace Freelancer.DTOs
{
    public class CreateTicketDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; } = "Medium"; // Mặc định là Medium
        public string? AttachmentUrl { get; set; } // Link ảnh lỗi (nếu có)
    }
}
