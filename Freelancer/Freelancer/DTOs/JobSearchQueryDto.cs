namespace Freelancer.DTOs
{
    // DTO này nhận các tham số lọc từ URL
    // Ví dụ: /api/projects?searchTerm=React&location=Hà Nội&minSalary=10000000
    public class JobSearchQueryDto
    {
        public string? SearchTerm { get; set; } // "Chức danh, từ khóa"
        public string? Location { get; set; } // "Địa điểm" (Hà Nội, ...)

        // (Từ bộ lọc "Mức lương")
        public decimal? MinSalary { get; set; }
        public decimal? MaxSalary { get; set; }

        public string? Level { get; set; } // "Cấp bậc" (Junior, ...)
        public string? WorkType { get; set; } // "Hình thức" (Full-time, ...)
    }
}