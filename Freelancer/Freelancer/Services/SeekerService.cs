
using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Freelancer.Services
    {
        public class SeekerService : ISeekerService
        {
            private readonly ApplicationDbContext _context;

            public SeekerService(ApplicationDbContext context)
            {
                _context = context;
            }

            public async Task<IEnumerable<SeekerSearchResultDto>> SearchSeekersAsync(SeekerSearchQueryDto query)
            {
                // 1. Bắt đầu với IQueryable
                var queryable = _context.Seekers
                    .Include(s => s.User) // Join bảng User
                                          // [MỚI] Thêm điều kiện lọc Role tại đây
                                          // Giả định trong bảng User của bạn có cột 'Role' lưu chuỗi "Seeker"
                    .Where(s => s.User.Role == "Seeker")
                    .AsQueryable();

                // 2. Lọc theo Địa điểm (Location)
                if (!string.IsNullOrEmpty(query.Location))
                {
                    queryable = queryable.Where(s => s.Location == query.Location);
                }

                // 3. Lọc theo Cấp bậc (Level)
                if (!string.IsNullOrEmpty(query.Level))
                {
                    queryable = queryable.Where(s => s.Level == query.Level);
                }

                // 4. Lọc theo Kỹ năng (Skills)
                if (!string.IsNullOrEmpty(query.Skills))
                {
                    var skillsToSearch = query.Skills.Split(',');

                    // Lưu ý: Cách viết hiện tại của bạn là lọc AND (Seeker phải có TẤT CẢ kỹ năng).
                    // Nếu bạn muốn lọc OR (có BẤT KỲ kỹ năng nào), logic sẽ cần viết khác đi một chút.
                    // Ở đây mình giữ nguyên logic hiện tại của bạn.
                    foreach (var skill in skillsToSearch)
                    {
                        if (!string.IsNullOrEmpty(skill))
                        {
                            queryable = queryable.Where(s => s.Skills.Contains(skill.Trim()));
                        }
                    }
                }

                // 5. Chạy query và Map sang DTO
                var seekers = await queryable
                    .OrderByDescending(s => s.IsVip)
                    .Take(50)
                    .ToListAsync();

                return seekers.Select(s => new SeekerSearchResultDto
                {
                    Id = s.Id,
                    FullName = s.User.FullName,
                    Headline = s.Headline,
                    Location = s.Location,
                    Level = s.Level,
                    Skills = s.Skills,
                    IsVip = s.IsVip
                });
            }

        // --- HÀM MỚI: ĐỀ XUẤT ỨNG VIÊN (VIP ONLY) ---
        public async Task<IEnumerable<SeekerSearchResultDto>> GetRecommendedCandidatesAsync(int employerId, int jobId)
        {
            // 1. Kiểm tra quyền VIP
            var employer = await _context.Employers.FindAsync(employerId);
            if (employer == null || !employer.IsVip)
            {
                return new List<SeekerSearchResultDto>();
            }

            // 2. Lấy thông tin Job
            var job = await _context.Projects.FindAsync(jobId);
            if (job == null) return new List<SeekerSearchResultDto>();

            // 3. Tách từ khóa (Keywords)
            var keywords = job.Title.ToLower()
                .Split(' ')
                .Where(k => k.Length > 2 && k != "tuyển" && k != "nhân" && k != "viên")
                .ToList();

            // 4. Lấy dữ liệu thô từ DB về trước (Chưa lọc Keyword vội để tránh lỗi SQL)
            // Lưu ý: Nếu data quá lớn thì mới cần dùng thư viện Search chuyên dụng (Full-text Search).
            // Với quy mô đồ án, lấy hết về RAM rồi lọc là OK.
            var allSeekers = await _context.Seekers
                .Include(s => s.User)
                .AsNoTracking()
                .OrderByDescending(s => s.User.CreatedDate) // Lấy người mới nhất
                .Take(100) // Lấy 100 người mới nhất để lọc dần (Tối ưu hiệu năng)
                .ToListAsync();

            // 5. Lọc trong RAM (In-Memory Filter) - Cách này an toàn tuyệt đối không lỗi
            var recommendedCandidates = allSeekers;

            if (keywords.Any())
            {
                recommendedCandidates = allSeekers
                    .Where(s => !string.IsNullOrEmpty(s.Headline) && // Check null để không crash
                                keywords.Any(k => s.Headline.ToLower().Contains(k)))
                    .ToList();
            }

            // 6. Lấy 10 người tốt nhất sau khi lọc
            var finalResult = recommendedCandidates.Take(10);

            // 7. Map sang DTO (ĐÃ SỬA LỖI MAPPING)
            return finalResult.Select(s => new SeekerSearchResultDto
            {
                Id = s.Id,
                FullName = s.User.FullName,
                Headline = s.Headline,
                AvatarUrl = s.AvatarUrl,

                // --- SỬA LẠI ĐOẠN NÀY ---
                Skills = s.Skills, // Gọi trực tiếp từ Seeker (s)
                Experience = s.Rank, // Hoặc s.Level tùy field bạn dùng
                Location = s.Location ?? "Toàn quốc",
                Level = s.Level,
                IsVip = s.IsVip
            });
        }
    }
}
    

