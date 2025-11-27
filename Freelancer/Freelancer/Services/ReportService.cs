using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace Freelancer.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService; // Để báo cho user khi xong

        public ReportService(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        // --- 1. TẠO BÁO CÁO ---
        public async Task<ReportDto> CreateReportAsync(int reporterId, CreateReportDto request)
        {
            var report = new Report
            {
                ReporterId = reporterId,
                ReportType = request.ReportType,
                Title = request.Title,
                Description = request.Description,
                AttachmentUrl = request.AttachmentUrl,
                Status = ReportStatus.Pending,
                CreatedDate = DateTime.UtcNow
            };

            _context.Reports.Add(report);
            await _context.SaveChangesAsync();

            // (Optional) Thông báo cho Admin có báo cáo mới (nếu muốn)

            return MapToDto(report, null); // User chưa cần thông tin chi tiết reporter
        }

        // --- 2. LẤY BÁO CÁO CỦA TÔI ---
        public async Task<IEnumerable<ReportDto>> GetMyReportsAsync(int userId)
        {
            var reports = await _context.Reports
                .Where(r => r.ReporterId == userId)
                .OrderByDescending(r => r.CreatedDate)
                .ToListAsync();

            return reports.Select(r => MapToDto(r, null));
        }

        // --- 3. ADMIN: LẤY TẤT CẢ ---
        public async Task<IEnumerable<ReportDto>> GetAllReportsAsync(ReportStatus? status)
        {
            var query = _context.Reports.Include(r => r.Reporter).AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(r => r.Status == status.Value);
            }

            var reports = await query.OrderByDescending(r => r.CreatedDate).ToListAsync();
            return reports.Select(r => MapToDto(r, r.Reporter));
        }

        // --- 4. ADMIN: XỬ LÝ BÁO CÁO ---
        public async Task<bool> RespondToReportAsync(int reportId, ReportStatus status, string response)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null) return false;

            report.Status = status;
            report.AdminResponse = response;
            await _context.SaveChangesAsync();

            // Gửi thông báo cho User
            try
            {
                string statusMsg = status == ReportStatus.Resolved ? "đã được giải quyết" : "đã bị từ chối";
                await _notificationService.CreateNotificationAsync(
                    recipientId: report.ReporterId,
                    actorId: null, // Hệ thống/Admin
                    message: $"Báo cáo '{report.Title}' của bạn {statusMsg}. Phản hồi: {response}",
                    linkUrl: "/my-reports" // Trang xem lịch sử báo cáo
                );
            }
            catch (Exception) { }

            return true;
        }

        // Helper Map
        private ReportDto MapToDto(Report r, User? reporter)
        {
            return new ReportDto
            {
                Id = r.Id,
                ReportType = r.ReportType,
                Title = r.Title,
                Description = r.Description,
                AttachmentUrl = r.AttachmentUrl,
                CreatedDate = r.CreatedDate,
                Status = r.Status.ToString(),
                AdminResponse = r.AdminResponse,
                // Nếu có thông tin reporter (Admin xem) thì điền, không thì thôi
                ReporterId = r.ReporterId,
                ReporterName = reporter?.FullName ?? "Tôi",
                ReporterEmail = reporter?.Email ?? ""
            };
        }
    }
}