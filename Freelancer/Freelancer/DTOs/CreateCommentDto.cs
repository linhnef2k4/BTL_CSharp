using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    // DTO này dùng để nhận data khi user GỬI comment
    public class CreateCommentDto
    {
        [Required(ErrorMessage = "Nội dung bình luận không được để trống")]
        public string Content { get; set; }
    }
}