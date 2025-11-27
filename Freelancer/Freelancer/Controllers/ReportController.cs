using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Phải đăng nhập
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }

        // --- API CHO USER ---

        // 1. Gửi báo cáo
        [HttpPost] // POST /api/report
        public async Task<IActionResult> CreateReport(CreateReportDto request)
        {
            var userId = GetUserIdFromToken();
            var report = await _reportService.CreateReportAsync(userId, request);
            return Ok(report);
        }

        // 2. Xem lịch sử báo cáo
        [HttpGet("my-reports")] // GET /api/report/my-reports
        public async Task<IActionResult> GetMyReports()
        {
            var userId = GetUserIdFromToken();
            var reports = await _reportService.GetMyReportsAsync(userId);
            return Ok(reports);
        }

        // --- API CHO ADMIN ---

        // 3. Xem tất cả báo cáo
        [HttpGet("admin/all")] // GET /api/report/admin/all?status=Pending
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllReports([FromQuery] ReportStatus? status)
        {
            var reports = await _reportService.GetAllReportsAsync(status);
            return Ok(reports);
        }

        // 4. Xử lý báo cáo
        [HttpPost("admin/{id}/respond")] // POST /api/report/admin/5/respond
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RespondToReport(int id, [FromBody] RespondReportDto request)
        {
            // (Chúng ta cần tạo thêm 1 DTO nhỏ cho request này hoặc dùng params)
            // Để đơn giản, mình dùng class nội bộ hoặc bạn tạo DTO riêng
            var success = await _reportService.RespondToReportAsync(id, request.Status, request.Response);

            if (!success) return NotFound("Báo cáo không tồn tại.");

            return Ok("Đã xử lý báo cáo.");
        }
    }

    // DTO nhỏ cho việc Admin phản hồi
    public class RespondReportDto
    {
        public ReportStatus Status { get; set; }
        public string Response { get; set; }
    }
}