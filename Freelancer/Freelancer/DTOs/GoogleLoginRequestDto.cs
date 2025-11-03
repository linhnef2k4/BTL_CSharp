
using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    public class GoogleLoginRequestDto
    {
        [Required]
        public string IdToken { get; set; }
    }
}