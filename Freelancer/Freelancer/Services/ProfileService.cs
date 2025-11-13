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
                PhoneNumber = user.PhoneNumber,
                Gender = user.Gender,
                Address = user.Address,
                DateOfBirth = user.DateOfBirth,

                // Map Seeker (nếu có)
                Seeker = user.Seeker == null ? null : new SeekerProfileDto
                {
                    Headline = user.Seeker.Headline,
                    IsVip = user.Seeker.IsVip,
                    Rank = user.Seeker.Rank,
                    ResumeUrl = user.Seeker.ResumeUrl,
                    YearsOfExperience = user.Seeker.YearsOfExperience
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
            // 1. Lấy User và Seeker profile (bắt buộc phải có Seeker theo logic)
            // Chú ý: Lần này KHÔNG dùng AsNoTracking() vì chúng ta cần CẬP NHẬT
            var user = await _context.Users
                .Include(u => u.Seeker)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Seeker == null)
            {
                return false; // Không tìm thấy user hoặc user không có hồ sơ seeker
            }

            // 2. Cập nhật thông tin User (Basic info)
            user.FullName = request.FullName;
            user.PhoneNumber = request.PhoneNumber;
            user.Gender = request.Gender;
            user.Address = request.Address;
            user.DateOfBirth = request.DateOfBirth;

            // 3. Cập nhật thông tin Seeker (Profile info)
            user.Seeker.Headline = request.Headline;
            user.Seeker.Rank = request.Rank;
            user.Seeker.ResumeUrl = request.ResumeUrl;
            user.Seeker.YearsOfExperience = request.YearsOfExperience;

            // 4. Lưu thay đổi
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
    }
}