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
        [AllowAnonymous]
        public async Task<IActionResult> GetApprovedProjects([FromQuery] JobSearchQueryDto query)
        {
            var projects = await _projectService.GetApprovedProjectsAsync(query);
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


        // --- API MỚI: SEEKER ỨNG TUYỂN VÀO JOB ---
        [HttpPost("{id}/apply")] // Route: POST /api/projects/5/apply
        [Authorize(Roles = "Seeker")] // <-- QUAN TRỌNG: Chỉ Seeker (hoặc cả Admin)
        public async Task<IActionResult> ApplyToJob(int id, ApplyToJobDto request)
        {
            var seekerId = GetUserIdFromToken(); // Lấy ID của Seeker đang đăng nhập
            var errorMessage = await _projectService.ApplyToJobAsync(id, seekerId, request);

            if (errorMessage != null)
            {
                // Nếu có lỗi (đã ứng tuyển, job không tồn tại...)
                return BadRequest(errorMessage);
            }

            return Ok("Ứng tuyển thành công!");
        }

        // --- API MỚI: EMPLOYER XEM DANH SÁCH CV ĐÃ NỘP ---
        [HttpGet("{id}/applications")] // Route: GET /api/projects/5/applications
        [Authorize(Roles = "Employer")] // Chỉ Employer
        public async Task<IActionResult> GetJobApplications(int id)
        {
            var employerId = GetUserIdFromToken();
            var applications = await _projectService.GetJobApplicationsAsync(id, employerId);

            if (applications == null)
            {
                // Lý do: 1. Job không tồn tại. 2. Job này không phải của bạn.
                return Forbid("Bạn không có quyền xem ứng viên của job này.");
            }

            return Ok(applications);
        }

        // --- 1. API SỬA JOB (Update) ---
        [HttpPut("{id}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> UpdateProject(int id, UpdateProjectDto request)
        {
            var employerId = GetUserIdFromToken();
            var error = await _projectService.UpdateProjectAsync(id, employerId, request);

            if (error != null)
            {
                return BadRequest(error);
            }

            return Ok("Cập nhật tin tuyển dụng thành công.");
        }

        // --- 2. API XÓA JOB (Soft Delete) ---
        [HttpDelete("{id}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var employerId = GetUserIdFromToken();
            var error = await _projectService.SoftDeleteProjectAsync(id, employerId);

            if (error != null)
            {
                return BadRequest(error);
            }

            return Ok("Đã xóa tin tuyển dụng thành công.");
        }

        // --- 3. API LẤY THÙNG RÁC JOB (Xem Job đã xóa) ---
        [HttpGet("trash")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetMyTrashedProjects()
        {
            var employerId = GetUserIdFromToken();
            var projects = await _projectService.GetMyTrashedProjectsAsync(employerId);
            return Ok(projects);
        }

        // --- 4. API KHÔI PHỤC JOB ---
        [HttpPost("trash/{id}/restore")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> RestoreProject(int id)
        {
            var employerId = GetUserIdFromToken();
            var error = await _projectService.RestoreProjectAsync(id, employerId);

            if (error != null) return BadRequest(error);

            return Ok("Khôi phục Job thành công.");
        }

        // --- 5. API XÓA VĨNH VIỄN JOB ---
        [HttpDelete("trash/{id}/permanent")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> DeleteProjectPermanent(int id)
        {
            var employerId = GetUserIdFromToken();
            var error = await _projectService.DeleteProjectPermanentAsync(id, employerId);

            if (error != null) return BadRequest(error);

            return Ok("Đã xóa vĩnh viễn Job.");
        }
    }
}