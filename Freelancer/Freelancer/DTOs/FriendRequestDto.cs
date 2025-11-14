namespace Freelancer.DTOs
{
    public class FriendRequestDto
    {
        // DTO này dùng để hiển thị: "Ai đã gửi yêu cầu cho TÔI"
        public int FriendshipId { get; set; } // ID của *yêu cầu*
        public int RequesterId { get; set; } // ID của *người gửi*
        public string RequesterFullName { get; set; }
        public string RequesterHeadline { get; set; } // "Frontend Developer"
        public DateTime RequestedDate { get; set; }
    }
}
