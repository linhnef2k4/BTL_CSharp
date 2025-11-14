using Freelancer.Interfaces;
using Microsoft.AspNetCore.Hosting; // Cần để lấy đường dẫn wwwroot
using Microsoft.AspNetCore.Http;
using System;
using System.IO; // Cần để xử lý tệp
using System.Threading.Tasks;

namespace Freelancer.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public FileService(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
        {
            _env = env; // Dùng để lấy đường dẫn thư mục wwwroot
            _httpContextAccessor = httpContextAccessor; // Dùng để lấy domain
        }

        public async Task<string> SaveFileAsync(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
            {
                throw new System.Exception("Không có tệp nào được tải lên.");
            }

            // 1. Lấy đường dẫn thư mục wwwroot
            // (Chúng ta sẽ lưu vào: wwwroot/uploads/[folderName])
            var uploadPath = Path.Combine(_env.WebRootPath, "uploads", folderName);

            // Đảm bảo thư mục tồn tại
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            // 2. Tạo tên tệp ngẫu nhiên (để tránh trùng lặp)
            // Ví dụ: ten-goc.jpg -> [GUID]-ten-goc.jpg
            var extension = Path.GetExtension(file.FileName);
            var uniqueFileName = Guid.NewGuid().ToString() + "-" + Path.GetFileNameWithoutExtension(file.FileName) + extension;
            var filePath = Path.Combine(uploadPath, uniqueFileName);

            // 3. Lưu tệp vào ổ đĩa
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 4. Trả về URL công khai (Public URL)
            // Lấy HttpContext (ví dụ: https://localhost:7123)
            var request = _httpContextAccessor.HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";

            // URL sẽ là: https://localhost:7123/uploads/[folderName]/[uniqueFileName]
            var fileUrl = $"{baseUrl}/uploads/{folderName}/{uniqueFileName}";

            return fileUrl;
        }
    }
}