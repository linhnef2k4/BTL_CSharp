using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Phải đăng nhập mới được gửi
    public class SupportController : ControllerBase
    {
        private readonly ISupportService _supportService;

        public SupportController(ISupportService supportService)
        {
            _supportService = supportService;
        }

        // 1. Gửi phiếu hỗ trợ (Dành cho User)
        // POST: api/support
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var result = await _supportService.CreateTicketAsync(userId, request);

            if (result != null) return BadRequest(result);
            return Ok(new { Message = "Đã gửi phiếu hỗ trợ thành công." });
        }

        // 2. Xem lịch sử phiếu của mình (Dành cho User)
        // GET: api/support/my-tickets
        [HttpGet("my-tickets")]
        public async Task<IActionResult> GetMyTickets()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var tickets = await _supportService.GetMyTicketsAsync(userId);
            return Ok(tickets);
        }

        // 3. Admin xem tất cả phiếu (Có thể lọc theo status: Pending/Resolved)
        // GET: api/support/admin/all?status=Pending
        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")] // Chỉ Admin được gọi
        public async Task<IActionResult> GetAllTickets([FromQuery] string? status)
        {
            var tickets = await _supportService.GetAllTicketsAsync(status);
            return Ok(tickets);
        }

        // 4. Admin đánh dấu đã xử lý xong
        // PUT: api/support/admin/resolve/{id}
        [HttpPut("admin/resolve/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResolveTicket(int id)
        {
            var result = await _supportService.ResolveTicketAsync(id);
            if (result != null) return BadRequest(result);
            return Ok(new { Message = "Đã xử lý phiếu thành công." });
        }
    }
}