using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;

namespace Freelancer.Services
{
    public class ProfileService : IProfileService
    {
        private readonly ApplicationDbContext _context;

        public ProfileService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfileDto> GetProfileAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Seeker)    // Lấy hồ sơ Seeker
                .Include(u => u.Employer)  // Lấy hồ sơ Employer
                .AsNoTracking() // Tăng tốc độ vì chỉ đọc
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return null;
            }

            // Map (Ánh xạ) từ Model sang DTO
            return new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
               
                PhoneNumber = user.PhoneNumber,
                Gender = user.Gender,
                DateOfBirth = user.DateOfBirth,


                // Map Seeker (nếu có)
                Seeker = user.Seeker == null ? null : new SeekerProfileDto
                {
                    Headline = user.Seeker.Headline,
                    IsVip = user.Seeker.IsVip,
                    ResumeUrl = user.Seeker.ResumeUrl,
                    YearsOfExperience = user.Seeker.YearsOfExperience,
                    Location = user.Seeker.Location,
                    Skills = user.Seeker.Skills,
                    Level = user.Seeker.Level,
                    Avatar = user.Seeker.AvatarUrl,
                },

                // Map Employer (nếu có)
                Employer = user.Employer == null ? null : new EmployerProfileDto
                {
                    CompanyName = user.Employer.CompanyName,
                    TaxCode = user.Employer.TaxCode,
                    CompanySize = user.Employer.CompanySize,
                    CompanyWebsite = user.Employer.CompanyWebsite,
                    Address = user.Employer.Address,
                    IsVip = user.Employer.IsVip,
                    Status = user.Employer.Status.ToString() // Chuyển Enum thành chuỗi
                }
            };
        }

        // (Bạn sẽ thêm hàm UpdateProfileAsync và RequestEmployerRoleAsync ở đây sau)
        // ... (Trong tệp Services/ProfileService.cs)
        // ... (Giữ nguyên hàm GetProfileAsync đã có)

        // --- THÊM HÀM MỚI NÀY VÀO CUỐI TỆP ---
        public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileRequestDto request)
        {
            // 1. Lấy User và CẢ HAI hồ sơ (Seeker và Employer)
            //    Chúng ta cần Include() cả hai
            var user = await _context.Users
                .Include(u => u.Seeker)   // Bao gồm Seeker
                .Include(u => u.Employer) // Bao gồm Employer
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return false; // Không tìm thấy user
            }

            // 2. Cập nhật thông tin User (chung)
            user.FullName = request.FullName;
            user.PhoneNumber = request.PhoneNumber;
            user.Gender = request.Gender;
            user.DateOfBirth = request.DateOfBirth;
            // (Lưu ý: Chúng ta đã XÓA user.Address)
            // (Bạn có thể cập nhật user.PhoneNumber, Gender... nếu DTO có)

            // 3. Cập nhật thông tin Seeker (nếu user này CÓ hồ sơ Seeker)
            if (user.Seeker != null)
            {
                user.Seeker.Headline = request.Headline;

                // 3 trường mới cho việc TÌM KIẾM
                user.Seeker.Location = request.Location;
                user.Seeker.Level = request.Level;
                user.Seeker.Skills = request.Skills;
            }

            // 4. Cập nhật thông tin Employer (nếu user này CÓ hồ sơ Employer)
            if (user.Employer != null)
            {
                user.Employer.CompanyName = request.CompanyName;
                user.Employer.CompanySize = request.CompanySize;
                user.Employer.CompanyWebsite = request.CompanyWebsite;

                // Đây là địa chỉ CÔNG TY
                user.Employer.Address = request.Address;
            }

            // 5. Lưu tất cả thay đổi
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                // Có thể log lỗi ở đây
                return false;
            }
        }

        // ... (Trong tệp Services/ProfileService.cs)
        // ... (Giữ nguyên hàm GetProfileAsync và UpdateProfileAsync đã có)

        // --- THÊM HÀM MỚI NÀY VÀO CUỐI TỆP ---
        public async Task<bool> RequestEmployerRoleAsync(int userId, EmployerRequestDto request)
        {
            // 1. Lấy thông tin User, kiểm tra xem họ đã có hồ sơ Employer chưa
            var user = await _context.Users
                .Include(u => u.Employer) // <-- Quan trọng
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return false; // Không tìm thấy user (rất hiếm vì đã qua Authorize)
            }

            // 2. Kiểm tra xem họ đã có hồ sơ Employer chưa
            if (user.Employer != null)
            {
                return false; // Đã có hồ sơ, không thể yêu cầu (trả về lỗi BadRequest)
            }

            // 3. Tạo hồ sơ Employer mới
            var newEmployerProfile = new Employer
            {
                Id = userId, // <-- Quan trọng: Id BẰNG với UserId
                CompanyName = request.CompanyName,
                TaxCode = request.TaxCode,
                CompanySize = request.CompanySize,
                CompanyWebsite = request.CompanyWebsite,
                Address = request.Address,
                IsVip = false, // Mặc định khi mới tạo
                Status = EmployerStatus.Pending // <-- Trạng thái chờ duyệt
            };

            // 4. Thêm vào DbContext và Lưu
            _context.Employers.Add(newEmployerProfile);
            await _context.SaveChangesAsync();

            return true;
        }
        // --- THÊM HÀM MỚI VÀO CUỐI TỆP ---
        public async Task<UserProfileDto> GetUserProfileByIdAsync(int userId)
        {
            // 1. Lấy User, Seeker, và Employer bằng ID
            var user = await _context.Users
                .Include(u => u.Seeker)   // Lấy hồ sơ Seeker
                .Include(u => u.Employer) // Lấy hồ sơ Employer
                .FirstOrDefaultAsync(u => u.Id == userId); // Tìm theo ID được truyền vào

            if (user == null)
            {
                return null; // Không tìm thấy
            }

            // 2. Map (Ánh xạ) sang DTO (Giống hệt hàm GetProfile "Me")
            var userProfileDto = new UserProfileDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,

                // Map hồ sơ Seeker (nếu có)
                Seeker = user.Seeker == null ? null : new SeekerProfileDto
                {
                    Headline = user.Seeker.Headline,
                    IsVip = user.Seeker.IsVip,

                    // --- SỬA LỖI TYPO TẠI ĐÂY ---
                    Location = user.Seeker.Location,
                    Level = user.Seeker.Level,   // <-- Sửa "use" thành "user.Seeker.Level"
                    Skills = user.Seeker.Skills  // <-- Sửa "us" thành "user.Seeker.Skills"
                },

                // Map hồ sơ Employer (nếu có)
                Employer = user.Employer == null ? null : new EmployerProfileDto
                {
                    CompanyName = user.Employer.CompanyName,
                    TaxCode = user.Employer.TaxCode,
                    Address = user.Employer.Address,
                    CompanySize = user.Employer.CompanySize,
                    CompanyWebsite = user.Employer.CompanyWebsite,
                    Status = user.Employer.Status.ToString(),
                    IsVip = user.Employer.IsVip
                }
            };

            return userProfileDto;
        }
    }
}