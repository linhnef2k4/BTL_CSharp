using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;

namespace Freelancer.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;

        public AdminService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ApproveProjectAsync(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);

            if (project == null || project.Status != ProjectStatus.Pending)
            {
                // Không tìm thấy project hoặc project không ở trạng thái "Chờ"
                return false;
            }

            // Cập nhật trạng thái
            project.Status = ProjectStatus.Approved;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectProjectAsync(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);

            if (project == null || project.Status != ProjectStatus.Pending)
            {
                return false;
            }

            // Cập nhật trạng thái
            project.Status = ProjectStatus.Rejected;

            await _context.SaveChangesAsync();
            return true;
        }

        // ... (Trong tệp Services/AdminService.cs)
        // ... (Giữ nguyên hàm ApproveProjectAsync và RejectProjectAsync)

        // --- THÊM 3 HÀM MỚI ---

        // ... (Các using và code cũ)

        // --- HÀM LẤY DANH SÁCH YÊU CẦU (CÓ TÌM KIẾM) ---
        public async Task<IEnumerable<EmployerProfileDto>> GetPendingEmployerRequestsAsync(string? searchTerm)
        {
            // 1. Khởi tạo query (Chưa chạy)
            var query = _context.Employers
                .Where(e => e.Status == EmployerStatus.Pending)
                .Include(e => e.User) // <-- Quan trọng: Include User để tìm theo Tên/Email
                .AsQueryable();

            // 2. Nếu có từ khóa tìm kiếm -> Thêm điều kiện lọc
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                string term = searchTerm.ToLower().Trim();

                query = query.Where(e =>
                    e.CompanyName.ToLower().Contains(term) ||    // Tìm theo Tên công ty
                    e.User.FullName.ToLower().Contains(term) ||  // Tìm theo Tên User
                    e.User.Email.ToLower().Contains(term)        // Tìm theo Email
                );
            }

            // 3. Chạy query lấy dữ liệu
            var pendingEmployers = await query
                .OrderByDescending(e => e.User.CreatedDate) // Mới nhất lên đầu
                .ToListAsync();

            // 4. Map sang DTO
            return pendingEmployers.Select(e => new EmployerProfileDto
            {
                Id = e.Id, // (Quan trọng) ID này dùng để Duyệt/Từ chối (UserId)
                FullName = e.User.FullName,
                Email = e.User.Email,

                CompanyName = e.CompanyName,
                TaxCode = e.TaxCode,
                Address = e.Address,
                CompanySize = e.CompanySize,
                CompanyWebsite = e.CompanyWebsite,
                Status = e.Status.ToString(),
                IsVip = e.IsVip
            });
        }

        public async Task<bool> ApproveEmployerRequestAsync(int employerUserId)
        {
            // 1. Tìm hồ sơ Employer
            var employer = await _context.Employers.FindAsync(employerUserId);

            if (employer == null || employer.Status != EmployerStatus.Pending)
            {
                return false; // Không tìm thấy hoặc đã được xử lý
            }

            // 2. Cập nhật trạng thái Employer
            employer.Status = EmployerStatus.Approved;

            // 3. --- CẬP NHẬT ROLE CỦA USER ---
            // Tìm User tương ứng
            var user = await _context.Users.FindAsync(employerUserId);
            if (user != null)
            {
                // Cập nhật Role thành "Employer"
                // (Lưu ý: Nếu họ vẫn muốn giữ quyền Seeker, logic này sẽ ghi đè.
                // Nhưng theo thiết kế token của chúng ta, "Employer" là vai trò cao hơn
                // và token vẫn check cả 2, nên việc set cứng này là OK để họ vào trang quản lý)
                user.Role = "Employer";
            }
            // -------------------------------

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectEmployerRequestAsync(int employerUserId)
        {
            var employer = await _context.Employers.FindAsync(employerUserId);

            if (employer == null || employer.Status != EmployerStatus.Pending)
            {
                return false;
            }

            employer.Status = EmployerStatus.Rejected;
            await _context.SaveChangesAsync();
            return true;
        }


        // --- 1. LẤY DANH SÁCH USER ---
        public async Task<IEnumerable<UserProfileDto>> GetAllUsersAsync(string? searchTerm, string? roleFilter, bool? trangThai)
        {
            var query = _context.Users
                .Include(u => u.Seeker)
                .Include(u => u.Employer)
                .AsQueryable();

            // Tìm kiếm
            if (!string.IsNullOrEmpty(searchTerm))
            {
                string term = searchTerm.ToLower();
                query = query.Where(u => u.FullName.ToLower().Contains(term) ||
                                         u.Email.ToLower().Contains(term));
            }

            // Lọc theo Role
            if (!string.IsNullOrEmpty(roleFilter))
            {
                query = query.Where(u => u.Role == roleFilter);
            }



            if (trangThai.HasValue)
            {
                query = query.Where(u => u.IsLocked == trangThai.Value);

            }
            var users = await query.OrderByDescending(u => u.CreatedDate).ToListAsync();

            return users.Select(u => new UserProfileDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role,
                IsLocked = u.IsLocked,
                // Map Seeker (nếu có)
                Seeker = u.Seeker == null ? null : new SeekerProfileDto
                {
                   
                    IsVip = u.Seeker.IsVip,
                    Avatar = u.Seeker.AvatarUrl,
                },

                // Map Employer (nếu có)
                Employer = u.Employer == null ? null : new EmployerProfileDto
                {
                    IsVip = u.Employer.IsVip,
                }
            });
        }

        // --- 2. LẤY CHI TIẾT USER ---
        public async Task<UserProfileDto> GetUserDetailAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Seeker)
                .Include(u => u.Employer)
                .FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null) return null;

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

        // --- 3. KHÓA / MỞ KHÓA ---
        public async Task<bool> ToggleUserLockAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Không cho phép khóa Admin
            if (user.Role == "Admin") return false;

            // Đảo ngược trạng thái (True -> False, False -> True)
            user.IsLocked = !user.IsLocked;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ResetUserPasswordAsync(int userId, string newDefaultPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false; // Không tìm thấy user
            }

            // Không cho phép đặt lại mật khẩu của Admin khác (để bảo mật)
            // (Trừ khi chính Admin đó tự đổi, nhưng đây là API quản trị)
            if (user.Role == "Admin")
            {
                return false;
            }

            // Mã hóa mật khẩu mới
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(newDefaultPassword);

            user.PasswordHash = passwordHash;

            // (Tùy chọn: Xóa luôn ResetToken cũ nếu có để tránh xung đột)
            user.ResetToken = null;
            user.ResetTokenExpires = null;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
    

