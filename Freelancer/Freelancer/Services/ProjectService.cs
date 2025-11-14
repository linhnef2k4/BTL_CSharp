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
        private readonly INotificationService _notificationService;
        private const int NON_VIP_JOB_LIMIT = 5; // Giới hạn 5 job cho user thường

        public ProjectService(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService; // <-- Gán
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
        // (Nhớ thêm "using System.Linq;" nếu chưa có)

        // --- THAY THẾ HÀM CŨ BẰNG HÀM MỚI NÀY ---
        public async Task<IEnumerable<ProjectDto>> GetApprovedProjectsAsync(JobSearchQueryDto query)
        {
            // 1. Bắt đầu query, chỉ lấy job "Approved"
            var queryable = _context.Projects
                .Where(p => p.Status == ProjectStatus.Approved)
                .Include(p => p.Employer)
                .OrderByDescending(p => p.CreatedDate)
                .AsQueryable(); // Biến nó thành query (chưa chạy)

            // 2. Lọc theo "Chức danh, từ khóa" (SearchTerm)
            if (!string.IsNullOrEmpty(query.SearchTerm))
            {
                var term = query.SearchTerm.ToLower();
                queryable = queryable.Where(p => p.Title.ToLower().Contains(term) ||
                                                 p.Description.ToLower().Contains(term));
            }

            // 3. Lọc theo "Địa điểm" (Location)
            if (!string.IsNullOrEmpty(query.Location))
            {
                queryable = queryable.Where(p => p.Location == query.Location);
            }

            // 4. Lọc theo "Cấp bậc" (Level)
            if (!string.IsNullOrEmpty(query.Level))
            {
                queryable = queryable.Where(p => p.Level == query.Level);
            }

            // 5. Lọc theo "Hình thức" (WorkType)
            if (!string.IsNullOrEmpty(query.WorkType))
            {
                queryable = queryable.Where(p => p.WorkType == query.WorkType);
            }

            // 6. Lọc theo "Mức lương" (Range)
            if (query.MinSalary.HasValue)
            {
                // Tìm job có Lương TỐI ĐA >= Lương tối thiểu user muốn
                queryable = queryable.Where(p => p.MaxSalary >= query.MinSalary.Value);
            }
            if (query.MaxSalary.HasValue)
            {
                // Tìm job có Lương TỐI THIỂU <= Lương tối đa user muốn
                queryable = queryable.Where(p => p.MinSalary <= query.MaxSalary.Value);
            }

            // 7. Chạy query (gọi DB) và Map sang DTO
            var projects = await queryable
                .Take(50) // Lấy 50 kết quả
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

        // ... (Trong tệp Services/ProjectService.cs)
        // ... (Giữ nguyên các hàm đã có)

        // --- THÊM HÀM MỚI VÀO CUỐI TỆP ---
        // ... (Trong tệp Services/ProjectService.cs)

        // --- THAY THẾ HÀM NÀY BẰNG CODE MỚI ---
        // (Trong tệp Services/ProjectService.cs)

        public async Task<string> ApplyToJobAsync(int projectId, int seekerId, ApplyToJobDto request)
        {
            // 1. (MỚI) Lấy hồ sơ Seeker để kiểm tra CV
            var seeker = await _context.Seekers.FindAsync(seekerId);
            if (seeker == null)
            {
                return "Không tìm thấy hồ sơ Seeker của bạn.";
            }

            // 2. (MỚI) Kiểm tra xem Seeker đã tải CV lên chưa
            if (string.IsNullOrEmpty(seeker.ResumeUrl))
            {
                return "Bạn phải tải CV lên hồ sơ (trang cá nhân) trước khi ứng tuyển.";
            }

            // 3. (Cũ) Lấy Job (BIẾN "project" GỐC)
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null || project.Status != ProjectStatus.Approved)
            {
                return "Job này không tồn tại hoặc chưa được duyệt.";
            }

            // 4. (Cũ) Kiểm tra xem Seeker đã ứng tuyển Job này CHƯA
            var existingApplication = await _context.JobApplications
                .AnyAsync(app => app.ProjectId == projectId && app.SeekerId == seekerId);

            if (existingApplication)
            {
                return "Bạn đã ứng tuyển vào job này rồi.";
            }

            // 5. (Cũ) Kiểm tra xem người đăng (Employer) có tự ứng tuyển không
            if (project.EmployerId == seekerId)
            {
                return "Bạn không thể tự ứng tuyển vào job của mình.";
            }

            // 6. (SỬA) Tạo đơn ứng tuyển
            var newApplication = new JobApplication
            {
                ProjectId = projectId,
                SeekerId = seekerId,
                CoverLetter = request.CoverLetter,
                CvUrl = seeker.ResumeUrl, // <-- Tự động lấy CV từ hồ sơ
                AppliedDate = DateTime.UtcNow,
                Status = ApplicationStatus.Pending
            };

            _context.JobApplications.Add(newApplication);
            await _context.SaveChangesAsync();

            // --- (PHẦN SỬA LỖI) ---
            try
            {
                // Lỗi là ở đây (KHÔNG được khai báo "var project" lần nữa)
                // Sửa đúng: Chúng ta dùng luôn biến "project" đã có ở trên

                await _notificationService.CreateNotificationAsync(
                    recipientId: project.EmployerId, // Dùng "project" (đã có)
                    actorId: seekerId,
                    message: $"đã ứng tuyển vào job của bạn: '{project.Title}'",
                    linkUrl: $"/employer/jobs/{project.Id}/applications"
                );
            }
            catch (System.Exception) { /* Lỗi gửi thông báo */ }
            // --- (KẾT THÚC SỬA LỖI) ---

            return null; // Thành công
        }

        // ... (Trong tệp Services/ProjectService.cs)
        // ... (Giữ nguyên các hàm đã có)

        // --- THÊM HÀM MỚI VÀO CUỐI TỆP ---
        // ... (Trong tệp Services/ProjectService.cs)
        // ... (Giữ nguyên các hàm đã có)

        // --- THAY THẾ HÀM NÀY BẰNG CODE MỚI ---
        public async Task<IEnumerable<JobApplicationDto>> GetJobApplicationsAsync(int projectId, int employerId)
        {
            // 1. Kiểm tra xem Job này có "thuộc" Employer này không
            //    VÀ lấy luôn thông tin VIP của Employer
            var project = await _context.Projects
                .Include(p => p.Employer) // <-- LẤY THÔNG TIN EMPLOYER
                .FirstOrDefaultAsync(p => p.Id == projectId && p.EmployerId == employerId);

            if (project == null)
            {
                return null; // Job không tồn tại hoặc không phải của bạn
            }

            // Lấy thông tin Employer (chủ của Job)
            var employer = project.Employer;

            // 2. Xây dựng câu query (chưa chạy)
            //    Chúng ta dùng "IQueryable" để xây dựng query động
            var query = _context.JobApplications
                .Where(app => app.ProjectId == projectId)
                .Include(app => app.Seeker)
                    .ThenInclude(seeker => seeker.User)
                .OrderByDescending(app => app.AppliedDate); // Sắp xếp CV mới nhất lên đầu

            // 3. (LOGIC VIP) Áp dụng giới hạn nếu LÀ USER THƯỜNG
            List<JobApplication> applications;
            if (!employer.IsVip)
            {
                // Chỉ lấy 5 bản
                applications = await query.Take(5).ToListAsync();
            }
            else
            {
                // VIP: Lấy tất cả
                applications = await query.ToListAsync();
            }

            // 4. Map sang DTO (giống hệt cũ)
            return applications.Select(app => new JobApplicationDto
            {
                Id = app.Id,
                CoverLetter = app.CoverLetter,
                CvUrl = app.CvUrl,
                AppliedDate = app.AppliedDate,
                Status = app.Status.ToString(),
                SeekerId = app.SeekerId,
                SeekerFullName = app.Seeker.User.FullName,
                SeekerHeadline = app.Seeker.Headline,
                SeekerEmail = app.Seeker.User.Email
            });
        }
    }
}