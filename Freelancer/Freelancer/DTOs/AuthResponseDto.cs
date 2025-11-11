namespace Freelancer.DTOs
{
    public class AuthResponseDto
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Token { get; set; } // Token để user dùng cho các request sau
    }
}