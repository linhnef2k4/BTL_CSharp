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

        public DbSet<JobApplication> JobApplications { get; set; }

        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ConversationUser> ConversationUsers { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Friendship> Friendships { get; set; }

        public DbSet<PaymentTransaction> PaymentTransactions { get; set; }
        public DbSet<Notification> Notifications { get; set; }
       
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

            // ... (bên trong OnModelCreating)
            // ... (Giữ nguyên các cấu hình cũ)

            // --- THÊM CẤU HÌNH CHO JOB APPLICATION ---
            modelBuilder.Entity<JobApplication>(entity =>
            {
                // Liên kết Application -> Project
                entity.HasOne(app => app.Project)
                    .WithMany() // Một Project có nhiều Application
                    .HasForeignKey(app => app.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade); // Xóa Project thì xóa Application

                // Liên kết Application -> Seeker (User)
                entity.HasOne(app => app.Seeker)
                    .WithMany() // Một Seeker có nhiều Application
                    .HasForeignKey(app => app.SeekerId)
                    .OnDelete(DeleteBehavior.Restrict); // Không cho xóa Seeker nếu họ đã ứng tuyển
            });


            // --- CẤU HÌNH BẢNG NỐI CONVERSATION-USER (N-N) ---
            modelBuilder.Entity<ConversationUser>(entity =>
            {
                // Tạo khóa chính phức hợp
                entity.HasKey(cu => new { cu.UserId, cu.ConversationId });

                // Liên kết tới User
                entity.HasOne(cu => cu.User)
                    .WithMany() // Một User có nhiều ConversationUser
                    .HasForeignKey(cu => cu.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Liên kết tới Conversation
                entity.HasOne(cu => cu.Conversation)
                    .WithMany(c => c.Participants) // Một Conversation có nhiều Participant
                    .HasForeignKey(cu => cu.ConversationId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // --- CẤU HÌNH MESSAGE ---
            modelBuilder.Entity<Message>(entity =>
            {
                // Liên kết Message -> Sender (User)
                entity.HasOne(m => m.Sender)
                    .WithMany() // Một User gửi nhiều Message
                    .HasForeignKey(m => m.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Liên kết Message -> Conversation
                entity.HasOne(m => m.Conversation)
                    .WithMany(c => c.Messages) // Một Conversation có nhiều Message
                    .HasForeignKey(m => m.ConversationId)
                    .OnDelete(DeleteBehavior.Cascade); // Xóa Conversation thì xóa Message
            });
            // --- CẤU HÌNH PAYMENT TRANSACTION ---
            modelBuilder.Entity<PaymentTransaction>(entity =>
            {
                // Liên kết Transaction -> Employer
                entity.HasOne(pt => pt.Employer)
                    .WithMany() // Một Employer có nhiều giao dịch
                    .HasForeignKey(pt => pt.EmployerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });


            // --- THÊM CẤU HÌNH MỚI CHO FRIENDSHIP ---
            modelBuilder.Entity<Friendship>(entity =>
            {
                // Quan hệ với Requester
                entity.HasOne(f => f.Requester)
                    .WithMany()
                    .HasForeignKey(f => f.RequesterId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Quan hệ với Receiver
                entity.HasOne(f => f.Receiver)
                    .WithMany()
                    .HasForeignKey(f => f.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Đảm bảo cặp (Requester, Receiver) là duy nhất
                entity.HasIndex(f => new { f.RequesterId, f.ReceiverId }).IsUnique();
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                // Liên kết Thông báo -> Người Nhận (User)
                entity.HasOne(n => n.Recipient)
                    .WithMany()
                    .HasForeignKey(n => n.RecipientId)
                    .OnDelete(DeleteBehavior.Cascade); // Xóa User -> Xóa luôn Thông báo

                // Liên kết Thông báo -> Người Gây ra (Actor)
                entity.HasOne(n => n.Actor)
                    .WithMany()
                    .HasForeignKey(n => n.ActorId)
                    // Đặt là Restrict hoặc SetNull (nếu ActorId là nullable int?)
                    .OnDelete(DeleteBehavior.Restrict);
            });

        }
    }
}
    
    