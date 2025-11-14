using Freelancer.Interfaces;
using Freelancer.Models; // <-- Cần cho ApplicationStatus
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Employer")] // Chỉ Employer
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;

        public ApplicationsController(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        // Hàm helper (copy từ controller khác)
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }

        // --- API 1: ĐÁNH DẤU ĐÃ XEM ---
        [HttpPost("{id}/mark-as-viewed")]
        public async Task<IActionResult> MarkAsViewed(int id)
        {
            var employerId = GetUserIdFromToken();
            var error = await _applicationService.UpdateApplicationStatusAsync(id, employerId, ApplicationStatus.Viewed);

            if (error != null)
            {
                // Trả về 403 Forbidden (hoặc 404)
                return Forbid(error);
            }
            return Ok("Đã đánh dấu là 'Đã xem'.");
        }

        // --- API 2: CHẤP NHẬN ---
        [HttpPost("{id}/accept")]
        public async Task<IActionResult> AcceptApplication(int id)
        {
            var employerId = GetUserIdFromToken();
            var error = await _applicationService.UpdateApplicationStatusAsync(id, employerId, ApplicationStatus.Accepted);

            if (error != null)
            {
                return Forbid(error);
            }
            return Ok("Đã 'Chấp nhận' ứng viên.");
        }

        // --- API 3: TỪ CHỐI ---
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectApplication(int id)
        {
            var employerId = GetUserIdFromToken();
            var error = await _applicationService.UpdateApplicationStatusAsync(id, employerId, ApplicationStatus.Rejected);

            if (error != null)
            {
                return Forbid(error);
            }
            return Ok("Đã 'Từ chối' ứng viên.");
        }

        // --- API MỚI: SEEKER XEM LỊCH SỬ ỨNG TUYỂN ---
        [HttpGet("my-applications")]
        [Authorize(Roles = "Seeker")] // <-- QUAN TRỌNG: Chỉ Seeker
        public async Task<IActionResult> GetMyApplications()
        {
            var seekerId = GetUserIdFromToken();
            var applications = await _applicationService.GetMyApplicationsAsync(seekerId);
            return Ok(applications);
        }
    }
}