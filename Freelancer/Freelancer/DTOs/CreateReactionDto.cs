using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    // DTO này nhận data khi user thả cảm xúc
    public class CreateReactionDto
    {
        [Required]
        public string ReactionType { get; set; } // "Like", "Love", "Haha"...
    }
}