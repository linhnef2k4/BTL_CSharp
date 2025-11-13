using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;

namespace Freelancer.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;

        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ApproveProjectAsync(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);

            if (project == null || project.Status != ProjectStatus.Pending)
            {
                // Không tìm thấy project hoặc project không ở trạng thái "Chờ"
                return false;
            }

            // Cập nhật trạng thái
            project.Status = ProjectStatus.Approved;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectProjectAsync(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);

            if (project == null || project.Status != ProjectStatus.Pending)
            {
                return false;
            }

            // Cập nhật trạng thái
            project.Status = ProjectStatus.Rejected;

            await _context.SaveChangesAsync();
            return true;
        }

        // ... (Trong tệp Services/AdminService.cs)
        // ... (Giữ nguyên hàm ApproveProjectAsync và RejectProjectAsync)

        // --- THÊM 3 HÀM MỚI ---

        public async Task<IEnumerable<EmployerProfileDto>> GetPendingEmployerRequestsAsync()
        {
            var pendingEmployers = await _context.Employers
                .Where(e => e.Status == EmployerStatus.Pending)
                .ToListAsync();

            // Map sang DTO (chúng ta đã có EmployerProfileDto từ trước)
            return pendingEmployers.Select(e => new EmployerProfileDto
            {
                //Lưu ý: Id của Employer chính là UserId
                CompanyName = e.CompanyName,
                TaxCode = e.TaxCode,
                Address = e.Address,
                CompanySize = e.CompanySize,
                CompanyWebsite = e.CompanyWebsite,
                Status = e.Status.ToString(),
                IsVip = e.IsVip
            });
        }

        public async Task<bool> ApproveEmployerRequestAsync(int employerUserId)
        {
            // ID của Employer cũng chính là User ID
            var employer = await _context.Employers.FindAsync(employerUserId);

            if (employer == null || employer.Status != EmployerStatus.Pending)
            {
                return false; // Không tìm thấy hoặc đã được xử lý
            }

            employer.Status = EmployerStatus.Approved;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectEmployerRequestAsync(int employerUserId)
        {
            var employer = await _context.Employers.FindAsync(employerUserId);

            if (employer == null || employer.Status != EmployerStatus.Pending)
            {
                return false;
            }

            employer.Status = EmployerStatus.Rejected;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
