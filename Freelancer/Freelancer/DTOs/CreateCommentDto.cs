using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    public class CreateCommentDto
    {
        [Required(ErrorMessage = "Nội dung bình luận không được để trống")]
        public string Content { get; set; }

        // --- THÊM DÒNG NÀY ---
        // (Nếu đây là comment gốc, để NULL. Nếu là reply, gửi ID của comment cha)
        public int? ParentCommentId { get; set; }
    }
}