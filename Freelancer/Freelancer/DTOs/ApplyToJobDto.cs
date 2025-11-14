using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    // DTO này nhận dữ liệu khi Seeker nộp CV
    public class ApplyToJobDto
    {
        [Required(ErrorMessage = "Vui lòng viết thư xin việc")]
        public string CoverLetter { get; set; }

        [Required(ErrorMessage = "Vui lòng cung cấp link CV")]
        [Url(ErrorMessage = "Link CV không hợp lệ")]
        public string CvUrl { get; set; }
    }
}