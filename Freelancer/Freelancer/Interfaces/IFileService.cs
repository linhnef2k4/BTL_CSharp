using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Freelancer.Interfaces
{
    public interface IFileService
    {
        // Hàm này sẽ lưu tệp vào một thư mục (folderName) và trả về URL
        Task<string> SaveFileAsync(IFormFile file, string folderName);
    }
}