using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;

namespace Freelancer.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;
        private const int NON_VIP_JOB_LIMIT = 5; // Giới hạn 5 job cho user thường

        public ProjectService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> CreateProjectAsync(int employerId, CreateProjectDto request)
        {
            // 1. Lấy thông tin Employer (bao gồm trạng thái VIP)
            var employer = await _context.Employers.FindAsync(employerId);
            if (employer == null || employer.Status != EmployerStatus.Approved)
            {
                return "Tài khoản của bạn chưa được duyệt.";
            }

            // 2. Kiểm tra phúc lợi (LOGIC VIP)
            if (!employer.IsVip)
            {
                // Nếu là user thường, đếm số job họ đã đăng
                var currentJobCount = await _context.Projects
                    .CountAsync(p => p.EmployerId == employerId &&
                               (p.Status == ProjectStatus.Approved || p.Status == ProjectStatus.Pending));

                if (currentJobCount >= NON_VIP_JOB_LIMIT)
                {
                    // Đã đạt giới hạn -> Trả về lỗi
                    return $"Tài khoản thường chỉ được đăng tối đa {NON_VIP_JOB_LIMIT} job.";
                }
            }

            // 3. Nếu là VIP (hoặc user thường chưa hết lượt) -> Tạo Job
            var newProject = new Project
            {
                Title = request.Title,
                Description = request.Description,
                Requirements = request.Requirements,
                Benefits = request.Benefits,
                Location = request.Location,
                MinSalary = request.MinSalary,
                MaxSalary = request.MaxSalary,
                WorkType = request.WorkType,
                Level = request.Level,
                EmployerId = employerId, // Gán ID của Employer
                Status = ProjectStatus.Pending // Mặc định chờ Admin duyệt
            };

            _context.Projects.Add(newProject);
            await _context.SaveChangesAsync();

            return null; // Thành công (không có lỗi)
        }

        // ... (Trong tệp Services/ProjectService.cs)
        // ... (Giữ nguyên hàm CreateProjectAsync)

        // --- THÊM HÀM MỚI NÀY VÀO CUỐI TỆP ---
        public async Task<IEnumerable<ProjectDto>> GetPendingProjectsAsync()
        {
            var pendingProjects = await _context.Projects
                .Where(p => p.Status == ProjectStatus.Pending) // Chỉ lấy job "Chờ duyệt"
                .Include(p => p.Employer) // Lấy luôn thông tin công ty
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();

            // Map (ánh xạ) danh sách Model sang DTO
            return pendingProjects.Select(p => new ProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Location = p.Location,
                MinSalary = p.MinSalary,
                MaxSalary = p.MaxSalary,
                WorkType = p.WorkType,
                Level = p.Level,
                CreatedDate = p.CreatedDate,
                Status = p.Status.ToString(), // Chuyển Enum thành "Pending"
                EmployerId = p.Employer.Id,
                CompanyName = p.Employer.CompanyName
            });
        }

        // ... (Trong tệp Services/ProjectService.cs)
        // ... (Giữ nguyên hàm CreateProjectAsync và GetPendingProjectsAsync)

        // --- THÊM HÀM MỚI NÀY VÀO CUỐI TỆP ---
        public async Task<IEnumerable<ProjectDto>> GetMyPendingProjectsAsync(int employerId)
        {
            var myPendingProjects = await _context.Projects
                .Where(p => p.EmployerId == employerId && // <-- CHỈ LẤY CỦA TÔI
                            p.Status == ProjectStatus.Pending) // <-- CHỈ LẤY "CHỜ DUYỆT"
                .Include(p => p.Employer)
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();

            // Map (ánh xạ) danh sách Model sang DTO (giống hệt hàm Admin)
            return myPendingProjects.Select(p => new ProjectDto
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

        // ... (Trong tệp Services/ProjectService.cs)
        // ... (Giữ nguyên các hàm đã có)

        // --- THÊM HÀM MỚI NÀY VÀO CUỐI TỆP ---
        public async Task<IEnumerable<ProjectDto>> GetApprovedProjectsAsync()
        {
            var approvedProjects = await _context.Projects
                .Where(p => p.Status == ProjectStatus.Approved) // <-- CHỈ LẤY JOB ĐÃ DUYỆT
                .Include(p => p.Employer) // Lấy thông tin công ty
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();

            // Map sang DTO (chúng ta đã tạo ProjectDto ở bước trước)
            return approvedProjects.Select(p => new ProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Location = p.Location,
                MinSalary = p.MinSalary,
                MaxSalary = p.MaxSalary,
                WorkType = p.WorkType,
                Level = p.Level,
                CreatedDate = p.CreatedDate,
                Status = p.Status.ToString(), // Sẽ là "Approved"
                EmployerId = p.Employer.Id,
                CompanyName = p.Employer.CompanyName
            });
        }

        // ... (Trong tệp Services/ProjectService.cs)
        // ... (Giữ nguyên các hàm đã có)

        // --- THÊM HÀM MỚI NÀY VÀO CUỐI TỆP ---
        public async Task<ProjectDetailDto> GetProjectByIdAsync(int projectId)
        {
            var project = await _context.Projects
                .Include(p => p.Employer) // Lấy thông tin công ty
                .FirstOrDefaultAsync(p => p.Id == projectId); // Tìm theo ID

            if (project == null)
            {
                return null; // Không tìm thấy
            }

            // Quan trọng: Chỉ trả về chi tiết nếu Job đã được DUYỆT (Approved)
            // (Bạn có thể bỏ qua điều kiện này nếu muốn Admin xem chi tiết cả job Pending)
            if (project.Status != ProjectStatus.Approved)
            {
                // Tạm thời chúng ta cho xem cả job "Pending" và "Rejected"
                // (Nhưng logic của trang "Tìm việc" chỉ hiển thị job Approved)
                // Nếu bạn muốn ẩn, hãy "return null;" ở đây
            }

            // Map (ánh xạ) sang DTO chi tiết
            return new ProjectDetailDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description, // <-- Chi tiết
                Requirements = project.Requirements, // <-- Chi tiết
                Benefits = project.Benefits, // <-- Chi tiết
                Location = project.Location,
                MinSalary = project.MinSalary,
                MaxSalary = project.MaxSalary,
                WorkType = project.WorkType,
                Level = project.Level,
                CreatedDate = project.CreatedDate,
                Status = project.Status.ToString(),

                // Thông tin Employer
                EmployerId = project.Employer.Id,
                CompanyName = project.Employer.CompanyName,
                CompanyWebsite = project.Employer.CompanyWebsite,
                CompanySize = project.Employer.CompanySize,
                CompanyAddress = project.Employer.Address
            };
        }
    }
}