using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Freelancer.Services
{
    public class JobService : IJobService
    {
        private readonly ApplicationDbContext _context;

        // Chỉ cần DbContext
        public JobService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int?> CreateJobAsync(JobRequestDto dto, ClaimsPrincipal userClaims)
        {
            // 1. Lấy ID của Employer từ Token
            var employerId = userClaims.FindFirstValue(ClaimTypes.NameIdentifier);
            if (employerId == null)
            {
                return null; // Lỗi token
            }

            // 2. (Quan trọng) Tìm Công ty của Employer này
            // Một Employer chỉ được đăng tin cho CÔNG TY CỦA MÌNH
            var company = await _context.Companies
                                        .FirstOrDefaultAsync(c => c.EmployerId == employerId);

            if (company == null)
            {
                // Nếu employer này CHƯA tạo hồ sơ công ty, không cho đăng
                return null;
            }

            // 3. Tạo đối tượng Job mới
            var job = new Job
            {
                Title = dto.Title,
                Description = dto.Description,
                Requirements = dto.Requirements,
                Salary = dto.Salary,
                Location = dto.Location,
                PostedAt = DateTime.UtcNow,
                CompanyId = company.Id // Gán khóa ngoại!!
            };

            // 4. Lưu vào CSDL
            await _context.Jobs.AddAsync(job);
            await _context.SaveChangesAsync();

            // 5. Trả về ID của Job vừa tạo
            return job.Id;
        }


        // === THÊM HÀM TÌM KIẾM (SEARCH) ===
        public async Task<PagedResultDto<JobSummaryDto>> SearchJobsAsync(string? searchTerm, string? location, int page, int pageSize)
        {
            // 1. Lấy IQueryable để xây dựng truy vấn động
            var query = _context.Jobs
                .Include(j => j.Company) // <-- JOIN với bảng Company
                .AsQueryable();

            // 2. Thêm điều kiện (Filter)
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(j =>
                    j.Title.Contains(searchTerm) ||
                    j.Description.Contains(searchTerm)
                );
            }

            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(j => j.Location.Contains(location));
            }

            // 3. Lấy tổng số kết quả (trước khi phân trang)
            var totalCount = await query.CountAsync();

            // 4. Phân trang (Pagination)
            var jobs = await query
                .OrderByDescending(j => j.PostedAt) // Mới nhất lên đầu
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // 5. Map từ Model (Job) sang DTO (JobSummaryDto)
            var jobDtos = jobs.Select(job => new JobSummaryDto
            {
                Id = job.Id,
                Title = job.Title,
                Location = job.Location,
                Salary = job.Salary,
                PostedAt = job.PostedAt,
                CompanyName = job.Company.CompanyName // Lấy tên từ bảng đã JOIN
            }).ToList();

            // 6. Trả về
            return new PagedResultDto<JobSummaryDto>(jobDtos, totalCount, page, pageSize);
        }

        // === THÊM HÀM LẤY CHI TIẾT (DETAIL) ===
        public async Task<JobDetailDto?> GetJobByIdAsync(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.Company) // JOIN với bảng Company
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
            {
                return null; // Không tìm thấy
            }

            // Map sang DTO chi tiết
            return new JobDetailDto
            {
                Id = job.Id,
                Title = job.Title,
                Description = job.Description,
                Requirements = job.Requirements,
                Location = job.Location,
                Salary = job.Salary,
                PostedAt = job.PostedAt,
                CompanyId = job.Company.Id,
                CompanyName = job.Company.CompanyName,
                CompanyDescription = job.Company.Description,
                CompanyLogoUrl = job.Company.LogoUrl
            };
        }
    }
}
