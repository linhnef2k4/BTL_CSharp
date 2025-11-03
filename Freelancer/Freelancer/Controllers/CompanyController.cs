
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Freelancer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employer")] // <-- BẢO VỆ API NÀY, CHỈ ROLE "Employer" MỚI ĐƯỢC VÀO
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        // Dùng [HttpPost] hoặc [HttpPut]. 
        // Dùng [HttpPost] "my-profile" cho dễ hiểu
        [HttpPost("my-profile")]
        public async Task<IActionResult> CreateOrUpdateProfile([FromBody] CompanyProfileRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // "User" là đối tượng có sẵn trong Controller, nó chứa thông tin từ Token
            var result = await _companyService.CreateOrUpdateCompanyProfileAsync(dto, User);

            if (!result)
            {
                return BadRequest(new { Message = "Cập nhật hồ sơ thất bại." });
            }

            return Ok(new { Message = "Hồ sơ công ty đã được cập nhật." });
        }
    }
}