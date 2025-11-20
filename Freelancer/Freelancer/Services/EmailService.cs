using Freelancer.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System.Threading.Tasks;

namespace Freelancer.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            // Lấy cấu hình từ appsettings.json
            var emailSettings = _config.GetSection("EmailSettings");

            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(emailSettings["Mail"]);
            email.From.Add(new MailboxAddress(emailSettings["DisplayName"], emailSettings["Mail"])); // Thêm người gửi
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            var builder = new BodyBuilder();
            builder.HtmlBody = body; // Cho phép gửi nội dung HTML (để link đẹp hơn)
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();

            // 1. Kết nối tới Gmail SMTP
            // (Host: smtp.gmail.com, Port: 587, TLS: StartTls)
            await smtp.ConnectAsync(emailSettings["Host"], int.Parse(emailSettings["Port"]), SecureSocketOptions.StartTls);

            // 2. Đăng nhập bằng Mật khẩu ứng dụng (App Password)
            await smtp.AuthenticateAsync(emailSettings["Mail"], emailSettings["Password"]);

            // 3. Gửi email
            await smtp.SendAsync(email);

            // 4. Ngắt kết nối
            await smtp.DisconnectAsync(true);
        }
    }
}