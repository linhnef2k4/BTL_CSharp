using Freelancer.Interfaces;
using Freelancer.Data; // Cần DbContext
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Bắt buộc đăng nhập
    public class UploadController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly ApplicationDbContext _context; // Cần DB để update

        public UploadController(IFileService fileService, ApplicationDbContext context)
        {
            _fileService = fileService;
            _context = context;
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }

        // --- API UPLOAD LOGO CÔNG TY ---
        [HttpPost("company-logo")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> UploadCompanyLogo(IFormFile file)
        {
            var userId = GetUserIdFromToken();
            var employer = await _context.Employers.FindAsync(userId);
            if (employer == null) return NotFound("Không tìm thấy Employer.");

            try
            {
                // 1. Lưu tệp vào thư mục "logos"
                var fileUrl = await _fileService.SaveFileAsync(file, "logos");

                // 2. Cập nhật link vào DB
                employer.CompanyLogoUrl = fileUrl;
                await _context.SaveChangesAsync();

                // 3. Trả về link
                return Ok(new { Url = fileUrl });
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // --- API UPLOAD AVATAR CÁ NHÂN ---
        [HttpPost("avatar")]
        [Authorize(Roles = "Seeker")] // Giả sử chỉ Seeker có Avatar
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            var userId = GetUserIdFromToken();
            var seeker = await _context.Seekers.FindAsync(userId);
            if (seeker == null) return NotFound("Không tìm thấy Seeker.");

            try
            {
                // 1. Lưu tệp vào thư mục "avatars"
                var fileUrl = await _fileService.SaveFileAsync(file, "avatars");

                // 2. Cập nhật link vào DB
                seeker.AvatarUrl = fileUrl; // (Đảm bảo Model Seeker có cột này)
                await _context.SaveChangesAsync();

                return Ok(new { Url = fileUrl });
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // --- API UPLOAD CV (PDF) ---
        [HttpPost("resume")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> UploadResume(IFormFile file)
        {
            var userId = GetUserIdFromToken();
            var seeker = await _context.Seekers.FindAsync(userId);
            if (seeker == null) return NotFound("Không tìm thấy Seeker.");

            try
            {
                // 1. Lưu tệp vào thư mục "resumes"
                var fileUrl = await _fileService.SaveFileAsync(file, "resumes");

                // 2. Cập nhật link vào DB
                seeker.ResumeUrl = fileUrl;
                await _context.SaveChangesAsync();

                return Ok(new { Url = fileUrl });
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // --- API UPLOAD FILE CHAT (Ảnh hoặc Tệp) ---
        [HttpPost("chat-file")] // POST /api/upload/chat-file
        [Authorize]
        public async Task<IActionResult> UploadChatFile(IFormFile file)
        {
            // Kiểm tra file rỗng
            if (file == null || file.Length == 0)
            {
                return BadRequest("Vui lòng chọn tệp.");
            }

            // Kiểm tra định dạng (Optional)
            // Ví dụ: Chỉ cho phép ảnh, pdf, docx...

            try
            {
                // 1. Lưu tệp vào thư mục "chat-files"
                var fileUrl = await _fileService.SaveFileAsync(file, "chat-files");

                // 2. Trả về URL (Frontend sẽ dùng URL này để gửi tin nhắn)
                return Ok(new { Url = fileUrl });
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}