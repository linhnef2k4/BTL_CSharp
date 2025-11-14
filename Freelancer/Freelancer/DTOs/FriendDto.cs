namespace Freelancer.DTOs
{
    // DTO này dùng để hiển thị: "Danh sách bạn bè CỦA TÔI"
    public class FriendDto
    {
        public int FriendId { get; set; } // ID của *người bạn*
        public string FriendFullName { get; set; }
        public string FriendHeadline { get; set; }
        public string FriendEmail { get; set; } // Cần để bắt đầu chat
    }
}
