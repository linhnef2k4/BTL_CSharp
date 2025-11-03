namespace Freelancer.DTOs
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public string Email { get; set; }
        public IList<string> Roles { get; set; }
    }
}