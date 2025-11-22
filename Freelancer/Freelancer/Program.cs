using Freelancer.Data;
using Freelancer.Interfaces;
using Freelancer.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Freelancer.Hubs;
// THÊM NAMESPACE NÀY ĐỂ SỬ DỤNG JwtBearerEvents VÀ CÁC TÙY CHỌN KHÁC
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Cấu hình Services (Dependency Injection) ---

// <<< THÊM VÀO: ĐỊNH NGHĨA CHÍNH SÁCH CORS ---
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173") // Cho phép origin của Vite
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials(); // Cần thiết nếu dùng SignalR hoặc cookie
                      });
});
// --- KẾT THÚC THÊM VÀO ---

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
builder.Services.AddScoped<ISeekerService, SeekerService>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();
builder.Services.AddScoped<IConversationService, ConversationService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IFriendshipService, FriendshipService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();


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

    // --- CẤU HÌNH ĐỂ SIGNALR NHẬN TOKEN TỪ QUERY STRING ---
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // SignalR gửi token qua query string với key là "access_token"
            var accessToken = context.Request.Query["access_token"];

            // Nếu request đến Hub (bắt đầu bằng /chathub) và có token
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chathub"))
            {
                // Gán token vào context để xác thực
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

// Thêm các service mặc định của API
builder.Services.AddControllers();

// Thêm Swagger (để tạo giao diện test API)
builder.Services.AddEndpointsApiExplorer();

// --- THÊM DÒNG NÀY (ĐỂ BẬT SIGNALR) ---
builder.Services.AddSignalR();

// (Chúng ta cũng cần HttpContextAccessor để lấy domain)
builder.Services.AddHttpContextAccessor();

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
// Cho phép truy cập các tệp trong wwwroot (như logo, avatar, cv)
app.UseStaticFiles();

// <<< THÊM VÀO: SỬ DỤNG CHÍNH SÁCH CORS ---
// (Phải đặt trước UseAuthentication và UseAuthorization)
app.UseCors(MyAllowSpecificOrigins);
// --- KẾT THÚC THÊM VÀO ---

app.UseAuthentication(); // Bật xác thực
app.UseAuthorization(); // Bật phân quyền

// --- THÊM DÒNG NÀY (ĐỂ ĐĂNG KÝ HUB) ---
// (Nó sẽ tạo ra 1 endpoint /chathub)
app.MapHub<ChatHub>("/chathub");
// --- KẾT THÚC ---

// Map các request tới đúng Controller
app.MapControllers();

// --- 5. Chạy ứng dụng ---
app.Run();