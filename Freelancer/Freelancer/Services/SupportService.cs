using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;

namespace Freelancer.Services
{
    public class SupportService : ISupportService
    {
        private readonly ApplicationDbContext _context;

        public SupportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> CreateTicketAsync(int userId, CreateTicketDto request)
        {
            var ticket = new SupportTicket
            {
                UserId = userId,
                Title = request.Title,
                Description = request.Description,
                AttachmentUrl = request.AttachmentUrl,
                Priority = request.Priority,
                Status = "Pending", // Mặc định là Chờ xử lý
                CreatedDate = DateTime.UtcNow
            };

            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync();
            return null; // Thành công
        }

        public async Task<IEnumerable<SupportTicketDto>> GetMyTicketsAsync(int userId)
        {
            var tickets = await _context.SupportTickets
                .Where(t => t.UserId == userId)
                .Include(t => t.User).ThenInclude(u => u.Seeker) // Để lấy avatar nếu cần
                .OrderByDescending(t => t.CreatedDate)
                .ToListAsync();

            return MapToDto(tickets);
        }

        public async Task<IEnumerable<SupportTicketDto>> GetAllTicketsAsync(string? status)
        {
            var query = _context.SupportTickets
                .Include(t => t.User)
                .ThenInclude(u => u.Seeker) // Load thông tin Seeker để lấy avatar (nếu là seeker)
                .Include(t => t.User)
                .ThenInclude(u => u.Employer) // Load thông tin Employer (nếu là employer)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(t => t.Status == status);
            }

            var tickets = await query.OrderByDescending(t => t.CreatedDate).ToListAsync();
            return MapToDto(tickets);
        }

        public async Task<string> ResolveTicketAsync(int ticketId)
        {
            var ticket = await _context.SupportTickets.FindAsync(ticketId);
            if (ticket == null) return "Không tìm thấy phiếu hỗ trợ.";

            ticket.Status = "Resolved";
            ticket.ResolvedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return null;
        }

        // Hàm phụ để map dữ liệu cho gọn
        private IEnumerable<SupportTicketDto> MapToDto(List<SupportTicket> tickets)
        {
            return tickets.Select(t => {
                // Logic lấy avatar hơi phức tạp vì User có thể là Seeker hoặc Employer
                string avatar = "";
                if (t.User.Seeker != null) avatar = t.User.Seeker.AvatarUrl;
                else if (t.User.Employer != null) avatar = t.User.Employer.CompanyLogoUrl;

                return new SupportTicketDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    AttachmentUrl = t.AttachmentUrl,
                    Priority = t.Priority,
                    Status = t.Status,
                    CreatedDate = t.CreatedDate,
                    SenderId = t.UserId,
                    SenderName = t.User.FullName,
                    SenderEmail = t.User.Email,
                    SenderAvatar = avatar
                };
            });
        }
    }
}