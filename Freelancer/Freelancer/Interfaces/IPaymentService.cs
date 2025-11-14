using Freelancer.Models;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Freelancer.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CreateVipPaymentUrlAsync(int employerId, HttpContext httpContext);
        Task<string> ProcessVnPayReturnAsync(IQueryCollection query);
    }
}