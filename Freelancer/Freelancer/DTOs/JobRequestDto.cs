
using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    public class JobRequestDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Requirements { get; set; }
        [Required]
        public string Salary { get; set; } // Giống model (dạng string)
        [Required]
        public string Location { get; set; }
    }
}