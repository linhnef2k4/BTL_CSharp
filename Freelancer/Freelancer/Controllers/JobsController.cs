
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Freelancer.Controllers
{
    [Route("api/jobs")] // Endpoint gốc là /api/jobs
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _jobService;

        public JobsController(IJobService jobService)
        {
            _jobService = jobService;
        }

        // Tạo API: POST /api/jobs
        [HttpPost]
        [Authorize(Roles = "Employer")] // BẮT BUỘC là Employer
        public async Task<IActionResult> PostJob([FromBody] JobRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // "User" là đối tượng có sẵn, lấy từ Token
            var jobId = await _jobService.CreateJobAsync(dto, User);

            if (jobId == null)
            {
                // Có 2 lý do: Lỗi token, hoặc CHƯA TẠO CÔNG TY
                return BadRequest(new { Message = "Đăng tin thất bại. Bạn phải tạo hồ sơ công ty trước." });
            }

            // Trả về 201 Created và ID của Job vừa tạo
            return CreatedAtAction(nameof(GetJobById), new { id = jobId }, new { JobId = jobId, Message = "Đăng tin thành công!" });
        }

        // (Chúng ta sẽ tạo hàm GetJobById ở bước sau)
        // === THÊM API TÌM KIẾM [GET] ===
        [HttpGet]
        [AllowAnonymous] // Cho phép tất cả mọi người (kể cả không đăng nhập)
        public async Task<IActionResult> SearchJobs(
            [FromQuery] string? searchTerm,
            [FromQuery] string? location,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _jobService.SearchJobsAsync(searchTerm, location, page, pageSize);
            return Ok(result);
        }

        // === SỬA LẠI API GET BY ID CŨ ===
        [HttpGet("{id}")]
        [AllowAnonymous] // Công khai
        public async Task<IActionResult> GetJobById(int id)
        {
            var job = await _jobService.GetJobByIdAsync(id);
            if (job == null)
            {
                return NotFound(); // Trả về 404 nếu không tìm thấy
            }
            return Ok(job);
        }
    }
}
