using System.ComponentModel.DataAnnotations;

namespace Freelancer.DTOs
{
    // DTO "Tất cả trong một" (All-in-One)
    public class UpdateProfileRequestDto
    {
        [Required]
        public string FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        // --- CÁC TRƯỜNG CỦA SEEKER ---
        // (Dùng cho "Tìm Ứng Viên" và Hồ sơ Seeker)
        public string? Headline { get; set; }
        public string? Location { get; set; } // "Hà Nội", "Hồ Chí Minh"
        public string? Level { get; set; }    // "Junior", "Senior"
        public string? Skills { get; set; }   // "React,Nodejs,SQL"

        // --- CÁC TRƯỜNG CỦA EMPLOYER ---
        // (Dùng cho "Hồ sơ công ty")
        public string? CompanyName { get; set; }
        public string? CompanySize { get; set; }
        public string? CompanyWebsite { get; set; }

        // Đây là địa chỉ CÔNG TY (không phải địa chỉ User đã xóa)
        public string? Address { get; set; }
    }
}