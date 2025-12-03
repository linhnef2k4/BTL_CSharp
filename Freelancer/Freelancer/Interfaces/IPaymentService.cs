
using Freelancer.DTOs;

namespace Freelancer.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CreateVipPaymentUrlAsync(int employerId, HttpContext httpContext);
        Task<string> ProcessVnPayReturnAsync(IQueryCollection query);
        // --- THÊM HÀM MỚI ---
        Task<string> CreateVipPaymentUrlForSeekerAsync(int seekerId, HttpContext httpContext);
        Task<string> QueryTransactionStatusAsync(int transactionId, HttpContext httpContext);
        Task<IEnumerable<PaymentTransactionDto>> GetAllTransactionsAsync();
        Task<string> RefundTransactionAsync(int transactionId, string adminUser, HttpContext httpContext);
    }
}