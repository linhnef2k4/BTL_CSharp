using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Freelancer.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public ApplicationService(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService; // <-- Gán
        }

        public async Task<string> UpdateApplicationStatusAsync(int applicationId, int employerId, ApplicationStatus newStatus)
        {
            // 1. Tìm đơn ứng tuyển, VÀ "include" Project để check chủ
            var application = await _context.JobApplications
                .Include(app => app.Project) // <-- Quan trọng: Lấy Project
                .FirstOrDefaultAsync(app => app.Id == applicationId);

            if (application == null)
            {
                return "Không tìm thấy đơn ứng tuyển này.";
            }

            // 2. Kiểm tra quyền sở hữu (Ownership)
            // EmployerId (người gọi) có phải là người đăng Job này không?
            if (application.Project.EmployerId != employerId)
            {
                return "Bạn không có quyền thay đổi đơn ứng tuyển này.";
            }

            // 3. Cập nhật trạng thái
            application.Status = newStatus;
            await _context.SaveChangesAsync();
            // --- (PHẦN NÂNG CẤP) TẠO THÔNG BÁO CHO SEEKER ---
            // (Chỉ thông báo khi Chấp nhận hoặc Từ chối, không thông báo khi "Đã xem")
            if (newStatus == ApplicationStatus.Accepted || newStatus == ApplicationStatus.Rejected)
            {
                try
                {
                    // Định nghĩa nội dung thông báo
                    string message = (newStatus == ApplicationStatus.Accepted)
                        ? $"đã chấp nhận đơn ứng tuyển của bạn cho job: '{application.Project.Title}'"
                        : $"đã từ chối đơn ứng tuyển của bạn cho job: '{application.Project.Title}'";

                    // Tạo thông báo cho Seeker (Recipient)
                    await _notificationService.CreateNotificationAsync(
                        recipientId: application.SeekerId,
                        actorId: employerId, // Employer là người gây ra (Actor)
                        message: message,
                        linkUrl: $"/my-applications" // Link tới trang "Lịch sử ứng tuyển"
                    );
                }
                catch (System.Exception) { /* Lỗi gửi thông báo */ }
            }
            // --- (KẾT THÚC NÂNG CẤP) ---
            return null; // Thành công
        }

        public async Task<IEnumerable<MyApplicationDto>> GetMyApplicationsAsync(int seekerId)
        {
            var applications = await _context.JobApplications
                .Where(app => app.SeekerId == seekerId) // Lấy đơn của tôi
                .Include(app => app.Project) // Lấy thông tin Project (Tên Job)
                    .ThenInclude(p => p.Employer) // Lấy thông tin Employer (Tên Công ty)
                .OrderByDescending(app => app.AppliedDate)
                .ToListAsync();

            // Map sang DTO
            return applications.Select(app => new MyApplicationDto
            {
                ApplicationId = app.Id,
                ProjectId = app.ProjectId,
                ProjectTitle = app.Project.Title,
                CompanyName = app.Project.Employer.CompanyName,
                AppliedDate = app.AppliedDate,
                Status = app.Status.ToString() // "Pending", "Viewed"...
            });
        }
    }
}