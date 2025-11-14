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
            // 1. Bắt đầu với IQueryable (chưa chạy query)
            // Chúng ta cần lấy Seeker VÀ User
            var queryable = _context.Seekers
                .Include(s => s.User) // Lấy thông tin User (FullName)
                .AsQueryable(); // Biến nó thành query

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
                // Tách chuỗi "React,Nodejs" thành mảng
                var skillsToSearch = query.Skills.Split(',');

                // Lọc tất cả Seeker có chứa BẤT KỲ kỹ năng nào
                foreach (var skill in skillsToSearch)
                {
                    if (!string.IsNullOrEmpty(skill))
                    {
                        // Dùng EF.Functions.Like hoặc Contains
                        queryable = queryable.Where(s => s.Skills.Contains(skill.Trim()));
                    }
                }
            }

            // 5. Chạy query và Map sang DTO
            var seekers = await queryable
                .OrderByDescending(s => s.IsVip) // Ưu tiên VIP lên đầu
                .Take(50) // Lấy 50 kết quả
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