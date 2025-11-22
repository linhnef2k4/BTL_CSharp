using Freelancer.Data;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography; // Cần thiết cho HMACSHA512
using System.Text;
using System.Threading.Tasks;

namespace Freelancer.Services
{
    // Đảm bảo class này implement IPaymentService
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private const decimal VIP_PRICE = 500000;

        public PaymentService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // ----------------------------------------------------------------------------------
        // --- HÀM 1: TẠO LINK THANH TOÁN (CHO EMPLOYER) ---
        // ----------------------------------------------------------------------------------
        public async Task<string> CreateVipPaymentUrlAsync(int employerId, HttpContext httpContext)
        {
            var employer = await _context.Employers.FindAsync(employerId);
            if (employer == null) throw new System.Exception("Không tìm thấy Employer.");
            if (employer.IsVip) throw new System.Exception("Bạn đã là VIP.");

            var now = DateTime.UtcNow;

            var transaction = new PaymentTransaction
            {
                EmployerId = employerId, // SeekerId sẽ là NULL
                Amount = VIP_PRICE,
                OrderInfo = $"Nang cap VIP cho {employer.CompanyName} (ID: {employerId})",
                Status = PaymentStatus.Pending,
                CreatedDate = now // Gán giá trị tường minh trước khi lưu
            };

            _context.PaymentTransactions.Add(transaction);
            await _context.SaveChangesAsync(); // <-- Cần DB cho phép NULL trên SeekerId

            return CreateVnPayUrl(transaction, httpContext);
        }

        // ----------------------------------------------------------------------------------
        // --- HÀM 2: TẠO LINK THANH TOÁN (CHO SEEKER) ---
        // ----------------------------------------------------------------------------------
        public async Task<string> CreateVipPaymentUrlForSeekerAsync(int seekerId, HttpContext httpContext)
        {
            var seeker = await _context.Seekers.FindAsync(seekerId);
            if (seeker == null) throw new System.Exception("Không tìm thấy Seeker.");
            if (seeker.IsVip) throw new System.Exception("Bạn đã là VIP.");

            var now = DateTime.UtcNow;

            var transaction = new PaymentTransaction
            {
                SeekerId = seekerId, // EmployerId sẽ là NULL
                Amount = VIP_PRICE,
                OrderInfo = $"Nang cap VIP cho Seeker (ID: {seekerId})",
                Status = PaymentStatus.Pending,
                CreatedDate = now // Gán giá trị tường minh trước khi lưu
            };

            _context.PaymentTransactions.Add(transaction);
            await _context.SaveChangesAsync(); // <-- Cần DB cho phép NULL trên EmployerId

            return CreateVnPayUrl(transaction, httpContext);
        }

        // ----------------------------------------------------------------------------------
        // --- HÀM 3: XỬ LÝ CALLBACK TỪ VNPAY ---
        // ----------------------------------------------------------------------------------
        public async Task<string> ProcessVnPayReturnAsync(IQueryCollection query)
        {
            string vnp_HashSecret = _config["VnPay:HashSecret"];

            var vnp_Params = new SortedList<string, string>(new VnPayCompare());
            string vnp_SecureHash = "";

            // Thu thập tham số và tách vnp_SecureHash
            foreach (var key in query.Keys)
            {
                if (key.StartsWith("vnp_"))
                {
                    if (key == "vnp_SecureHash")
                    {
                        vnp_SecureHash = query[key];
                    }
                    else if (key != "vnp_SecureHashType")
                    {
                        vnp_Params.Add(key, query[key]);
                    }
                }
            }

            // Tạo lại chuỗi dữ liệu để kiểm tra chữ ký
            StringBuilder signData = new StringBuilder();
            foreach (KeyValuePair<string, string> kv in vnp_Params)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    // LƯU Ý: Không cần UrlEncode khi tạo signData từ query
                    signData.Append(kv.Key + "=" + kv.Value + "&");
                }
            }
            if (signData.Length > 0)
            {
                signData.Remove(signData.Length - 1, 1);
            }

            string rawData = signData.ToString();
            string myChecksum = HmacSHA512(vnp_HashSecret, rawData);

            // So sánh chữ ký
            if (!myChecksum.Equals(vnp_SecureHash, StringComparison.InvariantCultureIgnoreCase))
            {
                return "failed"; // Sai chữ ký
            }

            // Lấy thông tin kết quả
            string vnp_ResponseCode = vnp_Params.ContainsKey("vnp_ResponseCode") ? vnp_Params["vnp_ResponseCode"] : "";
            string vnp_TxnRef = vnp_Params.ContainsKey("vnp_TxnRef") ? vnp_Params["vnp_TxnRef"] : "";
            string vnp_TransactionNo = vnp_Params.ContainsKey("vnp_TransactionNo") ? vnp_Params["vnp_TransactionNo"] : "";

            // Tìm giao dịch
            if (!int.TryParse(vnp_TxnRef, out int txnId))
            {
                return "failed"; // Lỗi định dạng TxnRef
            }

            var transaction = await _context.PaymentTransactions.FirstOrDefaultAsync(t => t.Id == txnId);
            if (transaction == null) return "failed"; // Không tìm thấy giao dịch

            // Xử lý trạng thái
            if (transaction.Status == PaymentStatus.Pending)
            {
                if (vnp_ResponseCode == "00")
                {
                    transaction.Status = PaymentStatus.Successful;
                    transaction.PaidDate = DateTime.UtcNow;
                    transaction.VnPayTransactionNo = vnp_TransactionNo;

                    // Kích hoạt VIP
                    if (transaction.EmployerId.HasValue)
                    {
                        var employer = await _context.Employers.FindAsync(transaction.EmployerId);
                        if (employer != null) employer.IsVip = true;
                    }
                    else if (transaction.SeekerId.HasValue)
                    {
                        var seeker = await _context.Seekers.FindAsync(transaction.SeekerId);
                        if (seeker != null) seeker.IsVip = true;
                    }

                    await _context.SaveChangesAsync();
                    return "success";
                }
                else
                {
                    transaction.Status = PaymentStatus.Failed;
                    await _context.SaveChangesAsync();
                    return "failed";
                }
            }

            return "success";
        }

        // ----------------------------------------------------------------------------------
        // --- HÀM HELPER: TẠO URL VNPAY ---
        // ----------------------------------------------------------------------------------
        private string CreateVnPayUrl(PaymentTransaction transaction, HttpContext httpContext)
        {
            string vnp_TmnCode = _config["VnPay:TmnCode"];
            string vnp_HashSecret = _config["VnPay:HashSecret"];
            string vnp_Url = _config["VnPay:BaseUrl"];
            string vnp_ReturnUrl = _config["VnPay:ReturnUrl"];

            SortedList<string, string> vnp_Params = new SortedList<string, string>(new VnPayCompare());
            vnp_Params.Add("vnp_Version", "2.1.0");
            vnp_Params.Add("vnp_Command", "pay");
            vnp_Params.Add("vnp_TmnCode", vnp_TmnCode);
            // vnp_Amount phải là tiền * 100 và là kiểu long
            vnp_Params.Add("vnp_Amount", (Convert.ToInt64(transaction.Amount) * 100).ToString());
            vnp_Params.Add("vnp_CreateDate", transaction.CreatedDate.ToString("yyyyMMddHHmmss"));
            vnp_Params.Add("vnp_CurrCode", "VND");
            vnp_Params.Add("vnp_IpAddr", GetIpAddress(httpContext));
            vnp_Params.Add("vnp_Locale", "vn");
            vnp_Params.Add("vnp_OrderInfo", transaction.OrderInfo);
            vnp_Params.Add("vnp_OrderType", "other");
            vnp_Params.Add("vnp_ReturnUrl", vnp_ReturnUrl);
            vnp_Params.Add("vnp_TxnRef", transaction.Id.ToString());

            StringBuilder signData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            foreach (KeyValuePair<string, string> kv in vnp_Params)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    // LƯU Ý: PHẢI UrlEncode giá trị khi tạo chuỗi query và signData
                    string encodedKey = WebUtility.UrlEncode(kv.Key);
                    string encodedValue = WebUtility.UrlEncode(kv.Value);

                    signData.Append(encodedKey + "=" + encodedValue + "&");
                    query.Append(encodedKey + "=" + encodedValue + "&");
                }
            }

            if (signData.Length > 0)
            {
                signData.Remove(signData.Length - 1, 1);
                query.Remove(query.Length - 1, 1);
            }

            string rawData = signData.ToString();
            string queryString = query.ToString();

            // Tính toán Secure Hash
            string vnp_SecureHash = HmacSHA512(vnp_HashSecret, rawData);

            string paymentUrl = vnp_Url + "?" + queryString + "&vnp_SecureHash=" + vnp_SecureHash;

            return paymentUrl;
        }

        // ----------------------------------------------------------------------------------
        // --- HÀM HELPER: Lấy IP Address ---
        // ----------------------------------------------------------------------------------
        private string GetIpAddress(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress?.ToString();
            // Xử lý cho môi trường Localhost
            if (string.IsNullOrEmpty(ip) || ip == "::1") ip = "127.0.0.1";
            return ip;
        }

        // ----------------------------------------------------------------------------------
        // --- HÀM HELPER: Băm HMACSHA512 ---
        // ----------------------------------------------------------------------------------
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

        // ----------------------------------------------------------------------------------
        // --- HÀM HELPER: Class so sánh tham số VNPay (theo ASCII) ---
        // ----------------------------------------------------------------------------------
        private class VnPayCompare : IComparer<string>
        {
            public int Compare(string x, string y)
            {
                if (x == y) return 0;
                if (x == null) return -1;
                if (y == null) return 1;
                // Sử dụng StringComparison.Ordinal để so sánh theo giá trị byte (giống ASCII)
                var compare = string.Compare(x, y, StringComparison.Ordinal);
                if (compare == 0) return 0;
                return compare;
            }
        }
    }
}