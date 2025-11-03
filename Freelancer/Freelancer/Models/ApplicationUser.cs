// Trong: Models/ApplicationUser.cs
using Microsoft.AspNetCore.Identity;

namespace Freelancer.Models
{
    // Kế thừa IdentityUser để có sẵn Email, PasswordHash...
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        // Thêm các trường bạn muốn (VD: Ngày sinh, Địa chỉ...)
    }
}