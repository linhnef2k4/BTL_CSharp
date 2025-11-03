// Đặt trong: Services/CompanyService.cs
using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Freelancer.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager; // Cần dùng UserManager

        // Tiêm (Inject) DbContext và UserManager
        public CompanyService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<bool> CreateOrUpdateCompanyProfileAsync(CompanyProfileRequestDto dto, ClaimsPrincipal userClaims)
        {
            // 1. Lấy ID của Employer từ Token
            var employerId = userClaims.FindFirstValue(ClaimTypes.NameIdentifier);
            if (employerId == null)
            {
                return false; // Lỗi (Token không hợp lệ)
            }

            // 2. Kiểm tra xem Employer này đã có công ty chưa
            var company = await _context.Companies
                                        .FirstOrDefaultAsync(c => c.EmployerId == employerId);

            if (company == null)
            {
                // 3a. Nếu CHƯA CÓ -> Tạo mới
                company = new Company
                {
                    CompanyName = dto.CompanyName,
                    Description = dto.Description,
                    Address = dto.Address,
                    LogoUrl = dto.LogoUrl,
                    EmployerId = employerId // Gán chủ sở hữu
                };
                await _context.Companies.AddAsync(company);
            }
            else
            {
                // 3b. Nếu CÓ RỒI -> Cập nhật
                company.CompanyName = dto.CompanyName;
                company.Description = dto.Description;
                company.Address = dto.Address;
                company.LogoUrl = dto.LogoUrl;
                _context.Companies.Update(company);
            }

            // 4. Lưu thay đổi vào CSDL
            var result = await _context.SaveChangesAsync();
            return result > 0; // Trả về true nếu lưu thành công
        }
    }
}