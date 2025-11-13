using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    public class CreateSocialPostDto
    {
        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string Content { get; set; }

        public string? ImageUrl { get; set; } // Link ảnh (không bắt buộc)
    }
}