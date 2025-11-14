namespace Freelancer.DTOs
{
    // DTO này là kết quả trả về cho Employer
    public class SeekerSearchResultDto
    {
        public int Id { get; set; } // Chính là UserId
        public string FullName { get; set; }
        public string Headline { get; set; }
        public string Location { get; set; }
        public string Level { get; set; }
        public string Skills { get; set; }
        public bool IsVip { get; set; } // Để hiển thị huy hiệu VIP
    }
}