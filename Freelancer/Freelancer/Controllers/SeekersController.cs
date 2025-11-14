using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

        // API TÌM ỨNG VIÊN
        // Route: GET /api/seekers/search?Level=Junior&Location=Hà Nội
        [HttpGet("search")]
        [Authorize(Roles = "Employer")] // Chỉ Employer mới được tìm
        public async Task<IActionResult> SearchSeekers([FromQuery] SeekerSearchQueryDto query)
        {
            var result = await _seekerService.SearchSeekersAsync(query);
            return Ok(result);
        }
    }
}