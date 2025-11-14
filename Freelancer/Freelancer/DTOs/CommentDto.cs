namespace Freelancer.DTOs
{
    // DTO này dùng để TRẢ VỀ danh sách comment
    public class CommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; }

        // Thông tin người bình luận
        public int AuthorId { get; set; }
        public string AuthorFullName { get; set; }
        public string AuthorHeadline { get; set; } // "Frontend Developer"

        // 1. Danh sách các cảm xúc và số lượng
        // (Ví dụ: {"Like": 10, "Love": 5})
        public Dictionary<string, int> ReactionCounts { get; set; }

        // 2. Cảm xúc của user đang xem (nếu có)
        // (Ví dụ: "Like", hoặc null nếu chưa thả)
        public string? MyReaction { get; set; }
    }
}