using System;

namespace Freelancer.DTOs
{
    public class FlaggedPostDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedDate { get; set; }

        // Từ khóa vi phạm tìm thấy (để Admin biết tại sao lại hiện bài này)
        public string MatchedKeyword { get; set; }

        // Thông tin người đăng (để Ban)
        public int AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string AuthorEmail { get; set; }
        public string AuthorAvatar { get; set; }
    }
}