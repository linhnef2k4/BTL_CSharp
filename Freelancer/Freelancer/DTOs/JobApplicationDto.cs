namespace Freelancer.DTOs
{
    // DTO này dùng để Employer xem CV đã nộp
    public class JobApplicationDto
    {
        public int Id { get; set; } // ID của Đơn ứng tuyển
        public string CoverLetter { get; set; }
        public string CvUrl { get; set; }
        public DateTime AppliedDate { get; set; }
        public string Status { get; set; } // "Pending", "Viewed"...

        // --- Thông tin Seeker đã nộp ---
        public int SeekerId { get; set; }
        public string SeekerFullName { get; set; }
        public string SeekerHeadline { get; set; } // "Frontend Developer"
        public string SeekerEmail { get; set; }
    }
}