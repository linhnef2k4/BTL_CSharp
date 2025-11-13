namespace Freelancer.DTOs
{
    public class UpdateProfileRequestDto
    {
        // --- Thông tin từ Model User ---
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; } // Địa chỉ cá nhân
        public DateTime? DateOfBirth { get; set; }

        // --- Thông tin từ Model Seeker ---
        public string Headline { get; set; } // Vị trí ứng tuyển
        public string Rank { get; set; } // Cấp bậc (Intern, Junior...)
        public string ResumeUrl { get; set; } // Link CV
        public int YearsOfExperience { get; set; } // Số năm kinh nghiệm
    }
}