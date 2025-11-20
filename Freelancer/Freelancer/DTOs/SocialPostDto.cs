namespace Freelancer.DTOs
{
    // DTO này chứa thông tin bài post VÀ tác giả của nó
    public class SocialPostDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedDate { get; set; }

        // Thông tin tác giả
        public int AuthorId { get; set; }
        public string AuthorFullName { get; set; }
        public string AuthorHeadline { get; set; } // "Frontend Developer"

        // 1. Tổng số bình luận
        public int CommentCount { get; set; } = 0;

        // 2. Danh sách các cảm xúc và số lượng
        // (Ví dụ: {"Like": 10, "Love": 5})
        public Dictionary<string, int> ReactionCounts { get; set; }

        // 3. Cảm xúc của user đang xem (nếu có)
        // (Ví dụ: "Like", hoặc null nếu chưa thả)
        public string? MyReaction { get; set; }

        public bool IsSaved { get; set; }
    }
}