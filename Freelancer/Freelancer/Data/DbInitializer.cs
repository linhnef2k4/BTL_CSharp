using Freelancer.Data;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;

namespace Freelancer.Data
{
    public class DbInitializer
    {
        private readonly ApplicationDbContext _context;

        // DbContext sẽ được "tiêm" vào (inject)
        public DbInitializer(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            // 1. Kiểm tra xem database đã có User nào chưa
            if (await _context.Users.AnyAsync())
            {
                return; // Đã có dữ liệu, không cần seed nữa
            }

            


            // --- 3. Tạo 10 User mẫu ---
            // Logic: 
            // - Tất cả 10 User đều CÓ hồ sơ Seeker (theo yêu cầu của bạn)
            // - 5 User trong số đó CŨNG CÓ hồ sơ Employer (để test)

            var usersToAdd = new List<User>();

            // Tạo 5 User chỉ là Seeker
            for (int i = 1; i <= 5; i++)
            {
                var user = new User
                {
                    FullName = $"Người tìm việc {i}",
                    Email = $"seeker{i}@example.com",
                    PasswordHash = "123456", // Cảnh báo: Chỉ dùng cho test!
                    PhoneNumber = $"090000000{i}",
                    Gender = "Male",
                    
                    DateOfBirth = new DateTime(1990 + i, 1, 1),
                };

                // Tạo hồ sơ Seeker
                var seekerProfile = new Seeker
                {
                    Headline = $"Lập trình viên .NET {i}",
                    IsVip = (i % 2 == 0), // Chẵn là VIP
                    Rank = "Junior",
                    ResumeUrl = $"http://example.com/cv/seeker{i}.pdf",
                    User = user // <-- Liên kết quan trọng
                };

                user.Seeker = seekerProfile; // <-- Liên kết 2 chiều
                usersToAdd.Add(user);
            }

            // Tạo 5 User vừa là Seeker, vừa là Employer
            for (int i = 6; i <= 10; i++)
            {
                var user = new User
                {
                    FullName = $"HR Công Ty {i}",
                    Email = $"employer{i}@example.com",
                    PasswordHash = "123456", // Cảnh báo: Chỉ dùng cho test!
                    PhoneNumber = $"091111111{i}",
                    Gender = "Female",
                   
                    DateOfBirth = new DateTime(1985 + i, 1, 1),
                };

                // 1. Họ vẫn có hồ sơ Seeker
                var seekerProfile = new Seeker
                {
                    Headline = $"Quản lý dự án {i}",
                    IsVip = false,
                    Rank = "Senior",
                    ResumeUrl = $"http://example.com/cv/manager{i}.pdf",
                    User = user // <-- Liên kết
                };
                user.Seeker = seekerProfile; // <-- Liên kết

                // 2. Họ có hồ sơ Employer (đã yêu cầu)
                var employerProfile = new Employer
                {
                    CompanyName = $"Công ty Tech {i}",
                    TaxCode = $"MST00{i}",
                    CompanySize = "100-500",
                    CompanyWebsite = $"http://company{i}.com",
                    Address = $"Trụ sở {i}, Khu công nghệ cao, TPHCM",
                    IsVip = (i % 2 == 0), // 6, 8, 10 là VIP

                    // Giả lập trạng thái "yêu cầu"
                    Status = (i % 3 == 0) ? EmployerStatus.Pending : EmployerStatus.Approved, // 6, 9 là Pending, còn lại Approved

                    User = user // <-- Liên kết
                };
                user.Employer = employerProfile; // <-- Liên kết

                usersToAdd.Add(user);
            }

            // Thêm tất cả 10 User (và hồ sơ Seeker/Employer đính kèm)
            await _context.Users.AddRangeAsync(usersToAdd);

            // --- 4. Lưu tất cả thay đổi xuống Database ---
            await _context.SaveChangesAsync();
        }
    }
}