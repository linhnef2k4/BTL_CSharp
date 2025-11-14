
namespace Freelancer.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Message { get; set; } // "Văn Đức Trung đã bình luận..."
        public string? LinkUrl { get; set; } // "/posts/5"
        public bool IsRead { get; set; }
        public DateTime CreatedDate { get; set; }

        // Thông tin người gây ra (nếu có)
        public int? ActorId { get; set; }
        public string? ActorFullName { get; set; }
        // (Bạn có thể thêm ActorAvatarUrl ở đây sau)
    }
}