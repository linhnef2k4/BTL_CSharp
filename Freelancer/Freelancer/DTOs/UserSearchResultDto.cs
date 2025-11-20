namespace Freelancer.DTOs
{
    public class UserSearchResultDto
    {
        public int Id { get; set; } // UserId
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; } // "Seeker", "Employer"

        // Headline (Seeker) hoặc Tên công ty (Employer)
        public string HeadlineOrCompany { get; set; }

        public string AvatarUrl { get; set; }
    }
}