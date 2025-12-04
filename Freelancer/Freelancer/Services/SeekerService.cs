
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
            // 1. Kiểm tra quyền VIP của Employer
            var employer = await _context.Employers.FindAsync(employerId);
            if (employer == null || !employer.IsVip)
            {
                // Nếu không phải VIP -> Trả về danh sách rỗng (hoặc ném lỗi tùy bạn chọn)
                // Ở đây mình trả về rỗng để Frontend hiển thị "Nâng cấp VIP để xem"
                return new List<SeekerSearchResultDto>();
            }

            // 2. Lấy thông tin Job để biết cần tìm người thế nào
            var job = await _context.Projects.FindAsync(jobId);
            if (job == null) return new List<SeekerSearchResultDto>();

            // 3. Xây dựng từ khóa tìm kiếm từ Tiêu đề Job
            // Ví dụ: Job là "Senior React Developer" -> Keywords: "React", "Developer"
            // (Bỏ qua các từ nối như "Senior", "Junior", "Tuyển" để tìm rộng hơn)
            var keywords = job.Title.ToLower()
                .Split(' ')
                .Where(k => k.Length > 3 && k != "tuyển" && k != "nhân" && k != "viên")
                .ToList();

            // 4. Truy vấn tìm Ứng viên phù hợp
            var query = _context.Seekers
                .Include(s => s.User)
                .AsNoTracking()
                .AsQueryable();

            // Lọc 1: Tìm người có Headline chứa từ khóa của Job
            // (Cách này hơi thủ công vì EF Core không hỗ trợ Contains List tốt)
            if (keywords.Any())
            {
                // Logic: Lấy những người mà Headline chứa ÍT NHẤT 1 từ khóa trong Job Title
                query = query.Where(s => keywords.Any(k => s.Headline.Contains(k)));
            }

            // Lọc 2: (Optional) Ưu tiên cùng địa điểm nếu Job có yêu cầu địa điểm cụ thể
            // if (!string.IsNullOrEmpty(job.Location) && job.Location != "Remote")
            // {
            //     query = query.Where(s => s.User.Address.Contains(job.Location));
            // }

            // 5. Lấy kết quả (Giới hạn 10 người đề xuất tốt nhất)
            var candidates = await query
                .OrderByDescending(s => s.User.CreatedDate) // Ưu tiên người mới
                .Take(10)
                .ToListAsync();

            // 6. Map sang DTO
            return candidates.Select(s => new SeekerSearchResultDto
            {
                Id = s.Id,
                FullName = s.User.FullName,
                Headline = s.Headline,
                AvatarUrl = s.AvatarUrl,
                Skills = s.User.Seeker.Skills, // Nếu bạn chưa có bảng Skill riêng thì để tạm
                Experience = s.User.Seeker.Level,
                Location = s.User.Seeker.Location ?? "Toàn quốc"
            });
        }
    }
}
    

