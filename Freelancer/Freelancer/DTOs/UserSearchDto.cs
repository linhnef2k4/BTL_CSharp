namespace Freelancer.DTOs
{
    // DTO này dùng để trả về kết quả TÌM KIẾM người dùng
    public class UserSearchDto
{
    public int UserId { get; set; }
    public string FullName { get; set; }
    public string Headline { get; set; } // "Frontend Developer"
    public string Role { get; set; } // "Seeker" hay "Admin"
}
}