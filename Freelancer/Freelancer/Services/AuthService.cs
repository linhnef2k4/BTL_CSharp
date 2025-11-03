// Đặt trong: Services/AuthService.cs
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using System.Collections.Generic; 

namespace Freelancer.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        // "Tiêm" (Inject) 2 dịch vụ quản lý User và Role vào
        public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        public async Task<IdentityResult> RegisterAsync(RegisterRequestDto dto)
        {
            // 1. Tạo đối tượng ApplicationUser mới từ DTO
            var user = new ApplicationUser
            {
                Email = dto.Email,
                UserName = dto.Username,
                FullName = dto.FullName
            };

            // 2. Dùng UserManager để tạo user (nó sẽ tự động hash mật khẩu)
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return result; // Trả về lỗi nếu có (VD: Mật khẩu yếu, Email trùng)
            }

            // 3. (Rất quan trọng) Thêm vai trò (Role) cho user
            // Kiểm tra xem role "Seeker" hoặc "Employer" đã tồn tại chưa
            if (!await _roleManager.RoleExistsAsync(dto.Role))
            {
                // Nếu chưa, tạo nó
                await _roleManager.CreateAsync(new IdentityRole(dto.Role));
            }

            // Thêm user vào role họ đã chọn
            await _userManager.AddToRoleAsync(user, dto.Role);

            return result; // Trả về kết quả thành công
        }
        // === BẮT ĐẦU THÊM HÀM LOGINASYNC ===
        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
        {
            // 1. Kiểm tra User
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                // Không trả về "Email không tồn tại" vì lý do bảo mật
                // Chỉ cần trả về null (Controller sẽ xử lý)
                return null;
            }

            // 2. Kiểm tra Mật khẩu
            var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isPasswordValid)
            {
                return null; // Sai mật khẩu
            }

            // 3. Lấy Role (vai trò) của user
            var roles = await _userManager.GetRolesAsync(user);

            // 4. Mật khẩu đúng -> Tạo Token
            var token = GenerateJwtToken(user, roles);

            // 5. Trả về DTO
            return new LoginResponseDto
            {
                Email = user.Email,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo,
                Roles = roles
            };
        }

        // === KẾT THÚC HÀM LOGINASYNC ===

        // === THÊM HÀM PRIVATE ĐỂ TẠO TOKEN ===
        private JwtSecurityToken GenerateJwtToken(ApplicationUser user, IList<string> roles)
        {
            // 1. Tạo danh sách "Claims" (các thông tin muốn lưu trong Token)
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id), // User ID
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // ID của Token
            };

            // 2. Thêm Role (vai trò) vào Claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // 3. Lấy SecretKey từ appsettings.json
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));

            // 4. Tạo "giấy tờ" (Credentials)
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // 5. Tạo Token
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2), // Token hết hạn sau 2 giờ
                signingCredentials: creds
            );

            return token;
        }


        public async Task<LoginResponseDto> GoogleLoginAsync(GoogleLoginRequestDto dto)
        {
            // 1. Lấy Client ID từ appsettings.json
            var googleClientId = _configuration["GoogleAuth:ClientId"];

            // 2. Xác thực IdToken với Google
            GoogleJsonWebSignature.Payload payload;
            try
            {
                var validationSettings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new List<string> { googleClientId }
                };
                payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, validationSettings);
            }
            catch (Exception)
            {
                // Token không hợp lệ
                return null;
            }

            // 3. Token hợp lệ, lấy thông tin user từ Google
            var userEmail = payload.Email;
            var userName = payload.Name; // Hoặc userEmail nếu không có tên

            // 4. Kiểm tra xem user đã tồn tại trong CSDL của MÌNH chưa
            var user = await _userManager.FindByEmailAsync(userEmail);

            if (user == null)
            {
                // Nếu CHƯA, tạo user mới
                user = new ApplicationUser
                {
                    Email = userEmail,
                    UserName = userEmail, // Dùng email làm username cho đơn giản
                    FullName = userName,
                    EmailConfirmed = true // Vì Google đã xác thực email
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    // Lỗi khi tạo user
                    return null;
                }

                // QUAN TRỌNG: Gán vai trò mặc định cho user mới
                // Giả sử ai đăng nhập bằng Google cũng là "Seeker"
                if (!await _roleManager.RoleExistsAsync("Seeker"))
                {
                    await _roleManager.CreateAsync(new IdentityRole("Seeker"));
                }
                await _userManager.AddToRoleAsync(user, "Seeker");
            }

            // 5. User đã tồn tại (hoặc vừa được tạo), tạo Token của MÌNH
            var roles = await _userManager.GetRolesAsync(user);
            var token = GenerateJwtToken(user, roles); // Dùng lại hàm tạo token cũ

            // 6. Trả về LoginResponseDto (chứa token CỦA MÌNH)
            return new LoginResponseDto
            {
                Email = user.Email,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo,
                Roles = roles
            };
        }
    }
}