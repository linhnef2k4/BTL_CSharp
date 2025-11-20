
namespace Freelancer.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CreateVipPaymentUrlAsync(int employerId, HttpContext httpContext);
        Task<string> ProcessVnPayReturnAsync(IQueryCollection query);
        // --- THÊM HÀM MỚI ---
        Task<string> CreateVipPaymentUrlForSeekerAsync(int seekerId, HttpContext httpContext);
    }
}