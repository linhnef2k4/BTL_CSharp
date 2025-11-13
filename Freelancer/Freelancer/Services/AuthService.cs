using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Freelancer.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config; // Cần IConfiguration để đọc "Jwt:Key"

        public AuthService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<bool> RegisterAsync(RegisterRequestDto registerRequest)
        {
            // 1. Kiểm tra Email đã tồn tại chưa
            var userExists = await _context.Users.AnyAsync(u => u.Email == registerRequest.Email);
            if (userExists)
            {
                return false; // Email đã tồn tại
            }

            // 2. Mã hóa mật khẩu (HASHING)
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password);

            // 3. Tạo User
            var user = new User
            {
                Email = registerRequest.Email,
                FullName = registerRequest.FullName,
                PasswordHash = hashedPassword, // Dùng pass đã mã hóa
                CreatedDate = DateTime.UtcNow,
                Role = "Seeker"
            };

            // 4. Tạo hồ sơ Seeker (theo logic của bạn)
            var seekerProfile = new Seeker
            {
                IsVip = false,
                Rank = "Newbie",
                User = user // <-- Liên kết quan trọng
            };

            user.Seeker = seekerProfile; // <-- Liên kết 2 chiều

            // 5. Lưu vào DB
            _context.Users.Add(user); // EF Core sẽ tự động lưu cả User và Seeker
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto loginRequest)
        {
            // 1. Tìm User bằng Email
            var user = await _context.Users
                .Include(u => u.Seeker) // Lấy luôn thông tin Seeker
                .FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

            if (user == null)
            {
                return null; // Không tìm thấy email
            }

            // 2. Xác thực mật khẩu
            bool isValidPassword = BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash);

            if (!isValidPassword)
            {
                return null; // Sai mật khẩu
            }

            // 3. Mật khẩu ĐÚNG -> Tạo Token (JWT)
            string jwtToken = GenerateJwtToken(user);

            // 4. Trả về thông tin
            return new AuthResponseDto
            {
                Email = user.Email,
                FullName = user.FullName,
                Token = jwtToken
               
            };
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            // Lấy "Secret Key" từ appsettings.json
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName)
                // Bạn có thể thêm các Claim (thông tin) khác
            };

            // --- LỖI 2: LOGIC VAI TRÒ ĐÚNG (ĐÃ XÓA CÁC DÒNG LẶP) ---

            // 1. Lấy vai trò chính (Seeker hoặc Admin) từ bảng Users
            if (!string.IsNullOrEmpty(user.Role))
            {
                claims.Add(new Claim(ClaimTypes.Role, user.Role));
            }

            // 2. Lấy vai trò phụ (Employer)
            // (Một Seeker hoặc Admin cũng có thể là Employer)
            if (user.Employer != null && user.Employer.Status == EmployerStatus.Approved)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Employer"));
            }
            // --- KẾT THÚC ---

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), // Token hết hạn sau 1 giờ
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}