using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Freelancer.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly ApplicationDbContext _context;

        public StatisticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- 1. THỐNG KÊ TỔNG QUAN ---
        public async Task<AdminDashboardDto> GetAdminDashboardAsync()
        {
            // Đếm số lượng (CountAsync rất nhanh)
            var totalUsers = await _context.Users.CountAsync();
            var totalSeekers = await _context.Seekers.CountAsync();
            var totalEmployers = await _context.Employers.CountAsync();

            var totalJobs = await _context.Projects.CountAsync();
            var activeJobs = await _context.Projects
                .CountAsync(p => p.Status == ProjectStatus.Approved && !p.IsDeleted);

            var totalApplications = await _context.JobApplications.CountAsync();

            // Tính tổng doanh thu (chỉ lấy giao dịch thành công)
            var totalRevenue = await _context.PaymentTransactions
                .Where(t => t.Status == PaymentStatus.Successful)
                .SumAsync(t => t.Amount);

            return new AdminDashboardDto
            {
                TotalUsers = totalUsers,
                TotalSeekers = totalSeekers,
                TotalEmployers = totalEmployers,
                TotalJobs = totalJobs,
                ActiveJobs = activeJobs,
                TotalApplications = totalApplications,
                TotalRevenue = totalRevenue
            };
        }

        // --- 2. BIỂU ĐỒ DOANH THU (THEO NĂM) ---
        public async Task<IEnumerable<RevenueChartDto>> GetYearlyRevenueAsync(int year)
        {
            // Lấy dữ liệu doanh thu của năm được chọn
            var transactions = await _context.PaymentTransactions
                .Where(t => t.Status == PaymentStatus.Successful && t.PaidDate.HasValue && t.PaidDate.Value.Year == year)
                .ToListAsync();

            // Nhóm theo tháng và tính tổng
            var monthlyRevenue = transactions
                .GroupBy(t => t.PaidDate.Value.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Total = g.Sum(t => t.Amount)
                })
                .ToDictionary(k => k.Month, v => v.Total);

            // Tạo danh sách kết quả cho đủ 12 tháng (kể cả tháng 0đ)
            var result = new List<RevenueChartDto>();
            for (int i = 1; i <= 12; i++)
            {
                result.Add(new RevenueChartDto
                {
                    Month = $"Tháng {i}",
                    Revenue = monthlyRevenue.ContainsKey(i) ? monthlyRevenue[i] : 0
                });
            }

            return result;
        }

        // --- 3. DỰ ÁN GẦN ĐÂY (CHO BẢNG "RECENT PROJECTS") ---
        public async Task<IEnumerable<ProjectDto>> GetRecentProjectsAsync()
        {
            // Lấy 5 dự án mới nhất (bất kể trạng thái, nhưng chưa xóa)
            var projects = await _context.Projects
                .Where(p => !p.IsDeleted)
                .Include(p => p.Employer)
                .OrderByDescending(p => p.CreatedDate)
                .Take(5)
                .ToListAsync();

            return projects.Select(p => new ProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Location = p.Location,
                MinSalary = p.MinSalary,
                MaxSalary = p.MaxSalary,
                WorkType = p.WorkType,
                Level = p.Level,
                CreatedDate = p.CreatedDate,
                Status = p.Status.ToString(),
                EmployerId = p.Employer.Id,
                CompanyName = p.Employer.CompanyName
            });
        }


        // --- HÀM MỚI: LẤY HOẠT ĐỘNG GẦN ĐÂY ---
        public async Task<IEnumerable<RecentActivityDto>> GetRecentActivitiesAsync()
        {
            var activities = new List<RecentActivityDto>();

            // 1. Lấy 5 User mới nhất
            var newUsers = await _context.Users
                .OrderByDescending(u => u.CreatedDate)
                .Take(5)
                .Select(u => new RecentActivityDto
                {
                    Type = "User", // Loại hoạt động
                    Description = $"Người dùng mới: {u.FullName} ({u.Role})",
                    Time = u.CreatedDate,
                    LinkUrl = $"/admin/users/{u.Id}", // Link tới trang chi tiết User (Admin)
                    // ImageUrl = u.Seeker.AvatarUrl ?? u.Employer.CompanyLogoUrl (Nếu muốn hiển thị Avatar)
                })
                .ToListAsync();
            activities.AddRange(newUsers);

            // 2. Lấy 5 Job mới nhất (Kể cả Pending - Chờ duyệt)
            var newJobs = await _context.Projects
                .OrderByDescending(p => p.CreatedDate)
                .Take(5)
                .Select(p => new RecentActivityDto
                {
                    Type = "Job",
                    Description = $"Job mới: {p.Title} ({p.Employer.CompanyName})",
                    Time = p.CreatedDate,
                    LinkUrl = $"/jobs/{p.Id}", // Link tới trang chi tiết Job
                    // ImageUrl = p.Employer.CompanyLogoUrl
                })
                .ToListAsync();
            activities.AddRange(newJobs);

            // 3. Lấy 5 Giao dịch VIP thành công mới nhất
            var newPayments = await _context.PaymentTransactions
                .Where(p => p.Status == PaymentStatus.Successful)
                .Include(p => p.Employer) // Lấy tên công ty
                .Include(p => p.Seeker)   // Lấy tên Seeker (nếu có)
                .OrderByDescending(p => p.CreatedDate)
                .Take(5)
                .Select(p => new RecentActivityDto
                {
                    Type = "Payment",
                    // Hiển thị tên người thanh toán (Employer hoặc Seeker)
                    Description = $"Thanh toán VIP: {p.Amount:N0}đ ({(p.Employer != null ? p.Employer.CompanyName : p.Seeker.User.FullName)})",
                    Time = p.CreatedDate,
                    LinkUrl = null, // Không có trang chi tiết thanh toán (hoặc thêm nếu có)
                    // ImageUrl = p.Employer.CompanyLogoUrl ?? p.Seeker.AvatarUrl
                })
                .ToListAsync();
            activities.AddRange(newPayments);

            // 4. Sắp xếp lại tất cả theo thời gian (Mới nhất lên đầu) và lấy 10 cái
            return activities
                .OrderByDescending(a => a.Time)
                .Take(10);
        }
    }
}