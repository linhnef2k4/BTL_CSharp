using Freelancer.Models;
using Microsoft.EntityFrameworkCore;

// 1. Đảm bảo namespace là "Freelancer.Data"
namespace Freelancer.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // 2. Đăng ký tất cả các Model của bạn ở đây
        public DbSet<User> Users { get; set; }
        public DbSet<Seeker> Seekers { get; set; }
        public DbSet<Employer> Employers { get; set; }

        // (Nếu bạn có Model "Skill", bạn cũng thêm DbSet ở đây)


        // 3. Cấu hình quan hệ
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Luôn giữ dòng này

            // Cấu hình quan hệ 1:1 giữa User và Seeker
            // Khóa ngoại của Seeker (Seeker.Id) sẽ trỏ tới User
            modelBuilder.Entity<User>()
                .HasOne(user => user.Seeker)
                .WithOne(seeker => seeker.User)
                .HasForeignKey<Seeker>(seeker => seeker.Id);

            // Cấu hình quan hệ 1:1 giữa User và Employer
            // Khóa ngoại của Employer (Employer.Id) sẽ trỏ tới User
            modelBuilder.Entity<User>()
                .HasOne(user => user.Employer)
                .WithOne(employer => employer.User)
                .HasForeignKey<Employer>(employer => employer.Id);
        }
    }
}