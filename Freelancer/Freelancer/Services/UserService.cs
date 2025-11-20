using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Freelancer.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Phải có body "{ ... }" đầy đủ
        public async Task<IEnumerable<UserSearchResultDto>> SearchUsersAsync(string query, int currentUserId)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<UserSearchResultDto>();
            }

            string lowerQuery = query.ToLower().Trim();

            var users = await _context.Users
                .Where(u => u.Id != currentUserId)
                .Include(u => u.Seeker)
                .Include(u => u.Employer)
                .AsNoTracking()
                .Where(u =>
                    u.FullName.ToLower().Contains(lowerQuery) ||
                    u.Email.ToLower().Contains(lowerQuery) ||
                    (u.Seeker != null && u.Seeker.Headline.ToLower().Contains(lowerQuery)) ||
                    (u.Employer != null && u.Employer.CompanyName.ToLower().Contains(lowerQuery))
                )
                .Take(20)
                .ToListAsync();

            return users.Select(u => new UserSearchResultDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role,
                AvatarUrl = u.Seeker?.AvatarUrl,
                HeadlineOrCompany = u.Role == "Employer"
                    ? u.Employer?.CompanyName
                    : u.Seeker?.Headline ?? "Thành viên"
            });
        }
    }
}