
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
        }
    }

