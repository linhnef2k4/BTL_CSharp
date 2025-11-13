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
    }
}