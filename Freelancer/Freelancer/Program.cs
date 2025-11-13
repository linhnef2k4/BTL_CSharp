using Freelancer.Data; // <--- Import
using Freelancer.Interfaces;
using Freelancer.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text; // <--- Import
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Cấu hình Services (Dependency Injection) ---

// Lấy chuỗi kết nối từ appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Đăng ký DbContext với SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Đăng ký Service (ví dụ: IProjectService)
builder.Services.AddScoped<DbInitializer>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<ISocialPostService, SocialPostService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// (Thêm các service khác của bạn ở đây)
// builder.Services.AddScoped<IUserService, UserService>();

// --- Cấu hình xác thực JWT ---
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
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// Thêm các service mặc định của API
builder.Services.AddControllers();

// Thêm Swagger (để tạo giao diện test API)
builder.Services.AddEndpointsApiExplorer();
// --- THAY THẾ DÒNG "builder.Services.AddSwaggerGen();" BẰNG CÁI NÀY ---
builder.Services.AddSwaggerGen(options =>
{
    // 1. Định nghĩa "Security Definition" (Cách Swagger hiểu về Token)
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Nhập Token JWT (Ví dụ: 'Bearer eyJhbGci...')",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http, // Dùng HTTP
        Scheme = "Bearer", // Tên scheme
        BearerFormat = "JWT"
    });

    // 2. Áp dụng Security Definition này cho tất cả API
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
// --- KẾT THÚC THAY THẾ ---

// --- 2. Xây dựng ứng dụng ---
var app = builder.Build();

// --- 3. Logic chạy Seed Data (Dữ liệu mẫu) ---
// Chỉ chạy khi ở môi trường Development
if (app.Environment.IsDevelopment())
{
    // Tạo một "scope" (phạm vi) dịch vụ
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            // Lấy DbInitializer
            var dbInitializer = services.GetRequiredService<DbInitializer>();

            // Chạy hàm seed (nó sẽ tự kiểm tra và thêm data nếu DB trống)
            await dbInitializer.SeedAsync();
        }
        catch (Exception ex)
        {
            // Ghi log lỗi nếu có
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "Có lỗi xảy ra khi seed database.");
        }
    }
}

// --- 4. Cấu hình HTTP Request Pipeline (Middleware) ---

// Bật giao diện Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // <-- Giao diện Swagger sẽ chạy ở /swagger
}

// Tự động chuyển hướng sang HTTPS
app.UseHttpsRedirection();
app.UseAuthentication(); // Bật xác thực
app.UseAuthorization(); // Bật phân quyền

// (Bạn có thể thêm UseAuthentication() ở đây)
app.UseAuthorization();

// Map các request tới đúng Controller
app.MapControllers();

// --- 5. Chạy ứng dụng ---
app.Run();