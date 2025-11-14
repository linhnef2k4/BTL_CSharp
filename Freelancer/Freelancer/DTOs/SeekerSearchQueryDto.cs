namespace Freelancer.DTOs
{
    // DTO này nhận các tham số lọc từ URL
    // Ví dụ: /api/seekers/search?level=Junior&location=Hà Nội
    public class SeekerSearchQueryDto
    {
        public string? Skills { get; set; } // "React" hoặc "React,Nodejs"
        public string? Location { get; set; } // "Hà Nội"
        public string? Level { get; set; } // "Junior"
    }
}