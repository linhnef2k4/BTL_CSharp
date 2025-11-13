using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // <-- BẮT BUỘC: Chỉ Admin
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // --- API DUYỆT JOB ---
        // Dùng HttpPost hoặc HttpPatch đều được
        [HttpPost("projects/{id}/approve")]
        public async Task<IActionResult> ApproveProject(int id)
        {
            var result = await _adminService.ApproveProjectAsync(id);
            if (!result)
            {
                return NotFound("Không tìm thấy Project hoặc Project đã được duyệt/từ chối.");
            }
            return Ok("Duyệt Project thành công.");
        }

        // --- API TỪ CHỐI JOB ---
        [HttpPost("projects/{id}/reject")]
        public async Task<IActionResult> RejectProject(int id)
        {
            var result = await _adminService.RejectProjectAsync(id);
            if (!result)
            {
                return NotFound("Không tìm thấy Project hoặc Project đã được duyệt/từ chối.");
            }
            return Ok("Từ chối Project thành công.");
        }

        // ... (Trong tệp Controllers/AdminController.cs)
        // ... (Giữ nguyên các API "projects")

        // --- CÁC API MỚI ĐỂ DUYỆT EMPLOYER ---

        // 1. Lấy danh sách Employer chờ duyệt
        [HttpGet("employer-requests/pending")]
        public async Task<IActionResult> GetPendingEmployerRequests()
        {
            var requests = await _adminService.GetPendingEmployerRequestsAsync();
            return Ok(requests);
        }

        // 2. Duyệt Employer
        // (Lưu ý: {id} ở đây chính là UserId)
        [HttpPost("employer-requests/{id}/approve")]
        public async Task<IActionResult> ApproveEmployer(int id)
        {
            var result = await _adminService.ApproveEmployerRequestAsync(id);
            if (!result)
            {
                return NotFound("Không tìm thấy yêu cầu hoặc yêu cầu đã được xử lý.");
            }
            return Ok("Duyệt nhà tuyển dụng thành công.");
        }

        // 3. Từ chối Employer
        [HttpPost("employer-requests/{id}/reject")]
        public async Task<IActionResult> RejectEmployer(int id)
        {
            var result = await _adminService.RejectEmployerRequestAsync(id);
            if (!result)
            {
                return NotFound("Không tìm thấy yêu cầu hoặc yêu cầu đã được xử lý.");
            }
            return Ok("Từ chối nhà tuyển dụng thành công.");
        }
    }
}