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

        public DbSet<SocialPost> SocialPosts { get; set; }

        public DbSet<Project> Projects { get; set; }
        public DbSet<SocialPostComment> SocialPostComments { get; set; }
        public DbSet<SocialPostReaction> SocialPostReactions { get; set; }

        public DbSet<SocialCommentReaction> SocialCommentReactions { get; set; }
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

            // --- THÊM CẤU HÌNH CHO PROJECT ---
            modelBuilder.Entity<Project>()
                .HasOne(project => project.Employer) // Một Project thuộc về 1 Employer
                .WithMany() // Một Employer có thể có nhiều Project
                .HasForeignKey(project => project.EmployerId)
                .OnDelete(DeleteBehavior.Restrict); // Không cho xóa Employer nếu họ còn Project

            // --- THÊM CẤU HÌNH CHO COMMENT ---
            modelBuilder.Entity<SocialPostComment>(entity =>
            {
                // Liên kết Comment -> User (Author)
                entity.HasOne(comment => comment.Author)
                    .WithMany() // Một User có nhiều comment
                    .HasForeignKey(comment => comment.AuthorId)
                    .OnDelete(DeleteBehavior.Restrict); // Không xóa User nếu họ comment

                // Liên kết Comment -> SocialPost
                entity.HasOne(comment => comment.Post)
                    .WithMany() // Một Post có nhiều comment
                    .HasForeignKey(comment => comment.PostId)
                    .OnDelete(DeleteBehavior.Cascade); // Xóa Post thì xóa luôn Comment
            });

            // --- THÊM CẤU HÌNH CHO REACTION ---
            modelBuilder.Entity<SocialPostReaction>(entity =>
            {
                // Liên kết Reaction -> User
                entity.HasOne(reaction => reaction.User)
                    .WithMany()
                    .HasForeignKey(reaction => reaction.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Liên kết Reaction -> SocialPost
                entity.HasOne(reaction => reaction.Post)
                    .WithMany()
                    .HasForeignKey(reaction => reaction.PostId)
                    .OnDelete(DeleteBehavior.Cascade);
            });


            // ... (bên trong OnModelCreating)
            // ... (Giữ nguyên cấu hình của Reaction BÀI POST)

            // --- THÊM CẤU HÌNH CHO REACTION (COMMENT) ---
            modelBuilder.Entity<SocialCommentReaction>(entity =>
            {
                // Liên kết Reaction -> User
                entity.HasOne(reaction => reaction.User)
                    .WithMany()
                    .HasForeignKey(reaction => reaction.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Liên kết Reaction -> Comment
                entity.HasOne(reaction => reaction.Comment)
                    .WithMany() // Một Comment có nhiều Reaction
                    .HasForeignKey(reaction => reaction.CommentId)
                    .OnDelete(DeleteBehavior.Cascade); // Xóa Comment thì xóa luôn Reaction
            });
        }
    }
    
}