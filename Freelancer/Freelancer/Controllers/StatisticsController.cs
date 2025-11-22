using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/admin/statistics")] // Route: /api/admin/statistics
    [Authorize(Roles = "Admin")] // <-- QUAN TRỌNG: Chỉ Admin mới được xem
    public class StatisticsController : ControllerBase
    {
        private readonly IStatisticsService _statisticsService;

        public StatisticsController(IStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }

        // API 1: Lấy số liệu tổng quan (Dashboard Cards)
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _statisticsService.GetAdminDashboardAsync();
            return Ok(stats);
        }

        // API 2: Lấy biểu đồ doanh thu
        // GET /api/admin/statistics/revenue?year=2023
        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenueChart([FromQuery] int? year)
        {
            // Nếu không truyền năm, lấy năm hiện tại
            int targetYear = year ?? DateTime.UtcNow.Year;
            var chartData = await _statisticsService.GetYearlyRevenueAsync(targetYear);
            return Ok(chartData);
        }

        // API 3: Lấy dự án gần đây
        [HttpGet("recent-projects")]
        public async Task<IActionResult> GetRecentProjects()
        {
            var projects = await _statisticsService.GetRecentProjectsAsync();
            return Ok(projects);
        }

        // --- API: LẤY HOẠT ĐỘNG GẦN ĐÂY ---
        // Route: GET /api/admin/statistics/recent-activities
        [HttpGet("recent-activities")]
        public async Task<IActionResult> GetRecentActivities()
        {
            var activities = await _statisticsService.GetRecentActivitiesAsync();
            return Ok(activities);
        }
    }
}