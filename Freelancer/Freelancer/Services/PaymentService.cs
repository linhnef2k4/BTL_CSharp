using Freelancer.Data;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System; // <-- Cần
using System.Linq; // <-- Cần
using System.Text; // <-- Cần
using System.Threading.Tasks;
using System.Security.Cryptography; // <-- Dùng để băm (Hash)
using System.Collections.Generic; // <-- Cần

namespace Freelancer.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        private const decimal VIP_PRICE = 500000;

        // Xóa IVnpayService khỏi constructor
        public PaymentService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // --- HÀM 1: TẠO LINK THANH TOÁN ---
        public async Task<string> CreateVipPaymentUrlAsync(int employerId, HttpContext httpContext)
        {
            var employer = await _context.Employers.FindAsync(employerId);
            if (employer == null) throw new System.Exception("Không tìm thấy Employer.");
            if (employer.IsVip) throw new System.Exception("Bạn đã là VIP.");

            var transaction = new PaymentTransaction
            {
                EmployerId = employerId,
                Amount = VIP_PRICE,
                OrderInfo = $"Nang cap VIP cho {employer.CompanyName}",
                Status = PaymentStatus.Pending
            };
            _context.PaymentTransactions.Add(transaction);
            await _context.SaveChangesAsync();

            // --- BẮT ĐẦU LOGIC TẠO URL (THỦ CÔNG) ---

            // Lấy Cấu hình
            var vnp_Url = _config["VnPay:BaseUrl"];
            var vnp_TmnCode = _config["VnPay:TmnCode"];
            var vnp_HashSecret = _config["VnPay:HashSecret"];
            var vnp_ReturnUrl = _config["VnPay:ReturnUrl"];

            // Dùng SortedList để tự động sắp xếp (VNPay yêu cầu)
            var vnp_Params = new SortedList<string, string>(StringComparer.Ordinal);

            vnp_Params.Add("vnp_Version", "2.1.0");
            vnp_Params.Add("vnp_Command", "pay");
            vnp_Params.Add("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.Add("vnp_Amount", ((long)transaction.Amount * 100).ToString());
            vnp_Params.Add("vnp_CreateDate", transaction.CreatedDate.ToString("yyyyMMddHHmmss"));
            vnp_Params.Add("vnp_CurrCode", "VND");
            vnp_Params.Add("vnp_IpAddr", GetIpAddress(httpContext));
            vnp_Params.Add("vnp_Locale", "vn");
            vnp_Params.Add("vnp_OrderInfo", transaction.OrderInfo);
            vnp_Params.Add("vnp_OrderType", "other");
            vnp_Params.Add("vnp_ReturnUrl", vnp_ReturnUrl);
            vnp_Params.Add("vnp_TxnRef", transaction.Id);

            // Tạo chuỗi (string) để băm (Hash)
            var queryString = new StringBuilder();
            foreach (var (key, value) in vnp_Params)
            {
                if (!string.IsNullOrEmpty(value))
                {
                    queryString.Append(key + "=" + value + "&");
                }
            }
            queryString.Length--; // Bỏ dấu & cuối cùng

            // Băm (Hash) chuỗi bằng HMACSHA512
            string hash = HmacSHA512(vnp_HashSecret, queryString.ToString());

            // Gắn chữ ký vào cuối
            string paymentUrl = vnp_Url + "?" + queryString.ToString() + "&vnp_SecureHash=" + hash;
            return paymentUrl;
        }

        // --- HÀM 2: XỬ LÝ CALLBACK TỪ VNPAY ---
        public async Task<string> ProcessVnPayReturnAsync(IQueryCollection query)
        {
            var vnp_HashSecret = _config["VnPay:HashSecret"];

            // Dùng SortedList để kiểm tra
            var vnp_Params = new SortedList<string, string>(StringComparer.Ordinal);
            string vnp_SecureHash = "";

            // Lấy toàn bộ query
            foreach (var (key, value) in query)
            {
                if (key == "vnp_SecureHash")
                {
                    vnp_SecureHash = value.ToString();
                    continue;
                }
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnp_Params.Add(key, value.ToString());
                }
            }

            // Tạo chuỗi (string) để băm (Hash)
            var queryString = new StringBuilder();
            foreach (var (key, value) in vnp_Params)
            {
                if (!string.IsNullOrEmpty(value))
                {
                    queryString.Append(key + "=" + value + "&");
                }
            }
            queryString.Length--; // Bỏ dấu &

            // Băm (Hash)
            string hash = HmacSHA512(vnp_HashSecret, queryString.ToString());

            // --- KIỂM TRA CHỮ KÝ ---
            if (hash != vnp_SecureHash)
            {
                return "failed"; // Chữ ký không hợp lệ
            }

            // Lấy thông tin
            string vnp_TxnRef = vnp_Params["vnp_TxnRef"];
            string vnp_ResponseCode = vnp_Params["vnp_ResponseCode"];

            // Tìm Giao dịch
            var transaction = await _context.PaymentTransactions
                .FirstOrDefaultAsync(t => t.Id == vnp_TxnRef);

            if (transaction == null) return "failed";

            // Xử lý Giao dịch
            if (transaction.Status == PaymentStatus.Pending)
            {
                if (vnp_ResponseCode == "00") // Thành công
                {
                    transaction.Status = PaymentStatus.Successful;
                    transaction.PaidDate = System.DateTime.UtcNow;
                    transaction.VnPayTransactionNo = vnp_Params["vnp_TransactionNo"];

                    var employer = await _context.Employers.FindAsync(transaction.EmployerId);
                    if (employer != null)
                    {
                        employer.IsVip = true;
                    }
                    await _context.SaveChangesAsync();
                    return "success";
                }
                else // Thất bại
                {
                    transaction.Status = PaymentStatus.Failed;
                    await _context.SaveChangesAsync();
                    return "failed";
                }
            }
            return "success";
        }

        // --- HÀM HELPER (TỰ VIẾT) ---
        private string GetIpAddress(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress?.ToString();
            if (ip == "::1") ip = "127.0.0.1";
            return ip ?? "127.0.0.1";
        }

        private string HmacSHA512(string key, string inputData)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }
            return hash.ToString();
        }
    }
}