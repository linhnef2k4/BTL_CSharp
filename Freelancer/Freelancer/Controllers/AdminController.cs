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
        public async Task<IActionResult> GetPendingEmployerRequests(string? searchTerm)
        {
            var requests = await _adminService.GetPendingEmployerRequestsAsync(searchTerm);
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

        // --- API QUẢN LÝ USER ---

        // 1. Lấy danh sách (có tìm kiếm)
        // GET /api/admin/users?search=Tuan&role=Seeker
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers([FromQuery] string? search, [FromQuery] string? role, [FromQuery] bool? trangThai)
        {
            var users = await _adminService.GetAllUsersAsync(search, role, trangThai);
            return Ok(users);
        }

        // 2. Xem chi tiết
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserDetail(int id)
        {
            var user = await _adminService.GetUserDetailAsync(id);
            if (user == null) return NotFound("Không tìm thấy người dùng.");
            return Ok(user);
        }

        // 3. Khóa / Mở khóa
        [HttpPost("users/{id}/toggle-lock")]
        public async Task<IActionResult> ToggleUserLock(int id)
        {
            var success = await _adminService.ToggleUserLockAsync(id);
            if (!success) return BadRequest("Không tìm thấy người dùng hoặc không thể khóa Admin.");

            return Ok("Đã thay đổi trạng thái khóa tài khoản.");
        }

        [HttpPost("users/{id}/reset-password")]
        public async Task<IActionResult> ResetUserPassword(int id)
        {
            // Đặt mật khẩu mặc định là "1" (hoặc bất kỳ chuỗi nào bạn muốn, ví dụ "Freelancer@123")
            string defaultPassword = "1";

            var success = await _adminService.ResetUserPasswordAsync(id, defaultPassword);

            if (!success)
            {
                return BadRequest("Không tìm thấy người dùng hoặc không thể đặt lại mật khẩu cho Quản trị viên.");
            }

            return Ok(new
            {
                Message = $"Đã đặt lại mật khẩu thành công. Mật khẩu mới là: {defaultPassword}",
                NewPassword = defaultPassword
            });
        }
    }
}
