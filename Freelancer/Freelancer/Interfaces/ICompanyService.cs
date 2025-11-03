
using Freelancer.DTOs;
using System.Security.Claims;

namespace Freelancer.Interfaces
{
    public interface ICompanyService
    {
        // Trả về true nếu thành công, false/Exception nếu thất bại
        // ClaimsPrincipal user: Để lấy ID của Employer đang đăng nhập từ Token
        Task<bool> CreateOrUpdateCompanyProfileAsync(CompanyProfileRequestDto dto, ClaimsPrincipal user);

        // (Sau này thêm hàm Get)
        // Task<CompanyProfileRequestDto> GetCompanyProfileAsync(ClaimsPrincipal user);
    }
}