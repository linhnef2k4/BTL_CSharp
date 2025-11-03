// Thêm 4 dòng "using" này lên đầu file
using Freelancer.Data;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.SqlServer;
using Freelancer.Interfaces;
using Freelancer.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

// === BẮT ĐẦU PHẦN CẤU HÌNH ===

// 1. Lấy chuỗi kết nối
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Đăng ký DbContext (cầu nối CSDL)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 3. Đăng ký dịch vụ Identity (Quản lý User, Role, Login)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();
// 4. Cấu hình "Máy đọc Token" (Authentication)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]))
    };
});
// Đăng ký các Service và Interface
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IJobService, JobService>();
// === KẾT THÚC PHẦN CẤU HÌNH ===


builder.Services.AddControllers();
// (Các dịch vụ Swagger, v.v... giữ nguyên)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // 1. Định nghĩa "Bearer" (JWT)
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Điền 'Bearer' [dấu cách] và dán token của bạn vào đây.\n\nVí dụ: 'Bearer eyJhbGciOi...'"
    });

    // 2. Yêu cầu Swagger sử dụng định nghĩa "Bearer" ở trên
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// === BẬT SWAGGER TẠI ĐÂY ===
// Template mặc định thường đặt 2 dòng này trong khối 'if'
// Chúng ta nên đặt nó bên ngoài 'if' để đảm bảo nó luôn chạy
app.UseSwagger();
app.UseSwaggerUI();

// ... (Code ở giữa giữ nguyên)
app.UseHttpsRedirection();

// THÊM 2 DÒNG NÀY (QUAN TRỌNG)
// Bật xác thực (phải đứng trước UseAuthorization)
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();// Ensure the following "using" directive is added at the top of the file


// This directive is required to enable the 'UseSqlServer' extension method for 'DbContextOptionsBuilder'.
