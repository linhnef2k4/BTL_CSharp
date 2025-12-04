using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeekersController : ControllerBase
    {
        private readonly ISeekerService _seekerService;

        public SeekersController(ISeekerService seekerService)
        {
            _seekerService = seekerService;
        }
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }
        // API TÌM ỨNG VIÊN
        // Route: GET /api/seekers/search?Level=Junior&Location=Hà Nội
        [HttpGet("search")]
        [Authorize(Roles = "Employer")] // Chỉ Employer mới được tìm
        public async Task<IActionResult> SearchSeekers([FromQuery] SeekerSearchQueryDto query)
        {
            var result = await _seekerService.SearchSeekersAsync(query);
            return Ok(result);
        }

        // --- API MỚI: LẤY ĐỀ XUẤT CHO 1 JOB CỤ THỂ ---
        // GET: api/seekers/recommendations/{jobId}
        [HttpGet("recommendations/{jobId}")]
        [Authorize(Roles = "Employer")] // Chỉ Employer mới được gọi
        public async Task<IActionResult> GetRecommendedCandidates(int jobId)
        {
            try
            {
                var employerId = GetUserIdFromToken();
                var candidates = await _seekerService.GetRecommendedCandidatesAsync(employerId, jobId);

                return Ok(candidates);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

    }
}