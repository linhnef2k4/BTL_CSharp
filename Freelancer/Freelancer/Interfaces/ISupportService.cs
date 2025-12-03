using Freelancer.DTOs;

namespace Freelancer.Interfaces
{
    public interface ISupportService
    {
        // User gửi phiếu
        Task<string> CreateTicketAsync(int userId, CreateTicketDto request);

        // Lấy danh sách phiếu của User (Lịch sử gửi)
        Task<IEnumerable<SupportTicketDto>> GetMyTicketsAsync(int userId);

        // --- ADMIN ---
        // Lấy tất cả phiếu (để Admin xử lý)
        Task<IEnumerable<SupportTicketDto>> GetAllTicketsAsync(string? status);

        // Admin xử lý phiếu (Resolved)
        Task<string> ResolveTicketAsync(int ticketId);
    }
}