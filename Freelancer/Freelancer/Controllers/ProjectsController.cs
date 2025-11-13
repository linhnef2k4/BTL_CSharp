using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        // --- API MỚI: LẤY DANH SÁCH JOB CÔNG KHAI (TRANG TÌM VIỆC) ---
        [HttpGet] // Route: GET /api/projects
        [AllowAnonymous] // <-- QUAN TRỌNG: Ai cũng gọi được
        public async Task<IActionResult> GetApprovedProjects()
        {
            var projects = await _projectService.GetApprovedProjectsAsync();
            return Ok(projects);
        }

        // --- API MỚI: LẤY CHI TIẾT 1 JOB ---
        [HttpGet("{id}")] // Route: GET /api/projects/5
        [AllowAnonymous] // Ai cũng gọi được
        public async Task<IActionResult> GetProjectById(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(id);

            if (project == null)
            {
                return NotFound("Không tìm thấy Job.");
            }

            return Ok(project);
        }

        // Hàm helper để lấy UserId từ Token (cũng chính là EmployerId)
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }

        // --- API ĐĂNG JOB MỚI ---
        [HttpPost]
        [Authorize(Roles = "Employer")] // <-- QUAN TRỌNG: Chỉ Employer
        public async Task<IActionResult> CreateProject(CreateProjectDto request)
        {
            var employerId = GetUserIdFromToken();
            var errorMessage = await _projectService.CreateProjectAsync(employerId, request);

            if (errorMessage != null)
            {
                // Nếu có lỗi (như hết lượt đăng)
                return BadRequest(errorMessage);
            }

            return Ok("Đăng job thành công. Vui lòng chờ Admin duyệt.");
        }

        // --- API LẤY CÁC JOB CHỜ DUYỆT (CHO ADMIN) ---
        [HttpGet("pending")]
        [Authorize(Roles = "Admin")] // <-- BẢO VỆ: Chỉ Admin mới được gọi
        public async Task<IActionResult> GetPendingProjects()
        {
            var projects = await _projectService.GetPendingProjectsAsync();
            return Ok(projects);
        }


        // --- API MỚI: LẤY JOB CHỜ CỦA TÔI (CHO EMPLOYER) ---
        [HttpGet("my-pending-jobs")]
        [Authorize(Roles = "Employer")] // <-- BẢO VỆ: Chỉ Employer
        public async Task<IActionResult> GetMyPendingProjects()
        {
            var employerId = GetUserIdFromToken(); // Lấy ID của Employer đang đăng nhập
            var projects = await _projectService.GetMyPendingProjectsAsync(employerId);
            return Ok(projects);
        }
    }
}