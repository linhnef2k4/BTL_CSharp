// Trong: Data/ApplicationDbContext.cs
using Freelancer.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Freelancer.Data
{
    // Kế thừa IdentityDbContext<ApplicationUser>
    // để nó tự động quản lý bảng Users, Roles...
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // --- Khai báo các bảng CSDL khác của bạn ở đây ---
        // Ví dụ (sau này bạn sẽ thêm):
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Company> Companies { get; set; }
    }
}