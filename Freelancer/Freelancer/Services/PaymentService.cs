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
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web; // Cần thêm package System.Web nếu có lỗi HttpUtility (thường có sẵn trong .NET)

namespace Freelancer.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private const decimal VIP_PRICE = 99999;

        // Constructor KHÔNG CÓ IVnpayService
        public PaymentService(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // --- HÀM 1: TẠO LINK THANH TOÁN (CHO EMPLOYER) ---
        public async Task<string> CreateVipPaymentUrlAsync(int employerId, HttpContext httpContext)
        {
            var employer = await _context.Employers.FindAsync(employerId);
            if (employer == null) throw new System.Exception("Không tìm thấy Employer.");
            if (employer.IsVip) throw new System.Exception("Bạn đã là VIP.");

            var transaction = new PaymentTransaction
            {
                EmployerId = employerId,
                // SeekerId tự động là null
                Amount = VIP_PRICE,
                OrderInfo = $"Nang cap VIP cho {employer.CompanyName}",
                Status = PaymentStatus.Pending,
                CreatedDate = DateTime.UtcNow
                // Id sẽ tự sinh (Auto Increment)
            };
            _context.PaymentTransactions.Add(transaction);
            await _context.SaveChangesAsync(); // Lưu để lấy Id

            return CreateVnPayUrl(transaction, httpContext);
        }

        // --- HÀM 2: TẠO LINK THANH TOÁN (CHO SEEKER) ---
        public async Task<string> CreateVipPaymentUrlForSeekerAsync(int seekerId, HttpContext httpContext)
        {
            var seeker = await _context.Seekers.FindAsync(seekerId);
            if (seeker == null) throw new System.Exception("Không tìm thấy Seeker.");
            if (seeker.IsVip) throw new System.Exception("Bạn đã là VIP.");

            var transaction = new PaymentTransaction
            {
                SeekerId = seekerId,
                // EmployerId tự động là null
                Amount = VIP_PRICE,
                OrderInfo = $"Nang cap VIP cho Seeker {seeker.Id}",
                Status = PaymentStatus.Pending,
                CreatedDate = DateTime.UtcNow
            };
            _context.PaymentTransactions.Add(transaction);
            await _context.SaveChangesAsync(); // Lưu để lấy Id

            return CreateVnPayUrl(transaction, httpContext);
        }

        // --- HÀM CHUNG: TẠO URL VNPAY (THỦ CÔNG - Manual Logic) ---
        private string CreateVnPayUrl(PaymentTransaction transaction, HttpContext httpContext)
        {
            string vnp_TmnCode = _config["VnPay:TmnCode"];
            string vnp_HashSecret = _config["VnPay:HashSecret"];
            string vnp_Url = _config["VnPay:BaseUrl"];
            string vnp_ReturnUrl = _config["VnPay:ReturnUrl"];

            // Sắp xếp tham số theo thứ tự bảng chữ cái (Bắt buộc với VNPay)
            SortedList<string, string> vnp_Params = new SortedList<string, string>(new VnPayCompare());
            vnp_Params.Add("vnp_Version", "2.1.0");
            vnp_Params.Add("vnp_Command", "pay");
            vnp_Params.Add("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.Add("vnp_Amount", ((long)transaction.Amount * 100).ToString()); // Nhân 100
            vnp_Params.Add("vnp_CreateDate", transaction.CreatedDate.ToString("yyyyMMddHHmmss"));
            vnp_Params.Add("vnp_CurrCode", "VND");
            vnp_Params.Add("vnp_IpAddr", GetIpAddress(httpContext));
            vnp_Params.Add("vnp_Locale", "vn");
            vnp_Params.Add("vnp_OrderInfo", transaction.OrderInfo);
            vnp_Params.Add("vnp_OrderType", "other");
            vnp_Params.Add("vnp_ReturnUrl", vnp_ReturnUrl);

            // Quan trọng: Chuyển đổi Id (int) sang chuỗi để gửi đi
            vnp_Params.Add("vnp_TxnRef", transaction.Id.ToString());

            StringBuilder signData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            foreach (KeyValuePair<string, string> kv in vnp_Params)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    // Sử dụng WebUtility.UrlEncode (có sẵn trong .NET Core)
                    string encodedKey = WebUtility.UrlEncode(kv.Key);
                    string encodedValue = WebUtility.UrlEncode(kv.Value);

                    if (signData.Length > 0)
                    {
                        signData.Append("&");
                        query.Append("&");
                    }

                    signData.Append(encodedKey + "=" + encodedValue);
                    query.Append(encodedKey + "=" + encodedValue);
                }
            }

            string rawData = signData.ToString();
            string queryString = query.ToString();
            string vnp_SecureHash = HmacSHA512(vnp_HashSecret, rawData);

            return vnp_Url + "?" + queryString + "&vnp_SecureHash=" + vnp_SecureHash;
        }

        // --- HÀM 3: XỬ LÝ CALLBACK TỪ VNPAY (THỦ CÔNG) ---
        // ... (Các using và các hàm khác giữ nguyên) ...

        // --- HÀM 3: XỬ LÝ CALLBACK TỪ VNPAY (CẬP NHẬT LOGIC GIA HẠN) ---
        public async Task<string> ProcessVnPayReturnAsync(IQueryCollection query)
        {
            string vnp_HashSecret = _config["VnPay:HashSecret"];

            var vnp_Params = new SortedList<string, string>(new VnPayCompare());
            string vnp_SecureHash = "";

            // Lấy tất cả tham số trả về
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
                    signData.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
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
            string vnp_TxnRefString = vnp_Params.ContainsKey("vnp_TxnRef") ? vnp_Params["vnp_TxnRef"] : "";
            string vnp_ResponseCode = vnp_Params.ContainsKey("vnp_ResponseCode") ? vnp_Params["vnp_ResponseCode"] : "";
            string vnp_TransactionNo = vnp_Params.ContainsKey("vnp_TransactionNo") ? vnp_Params["vnp_TransactionNo"] : "";

            // Chuyển đổi vnp_TxnRef (String) về int để tìm trong DB
            if (!int.TryParse(vnp_TxnRefString, out int transactionId))
            {
                return "failed"; // Mã giao dịch không hợp lệ
            }

            var transaction = await _context.PaymentTransactions.FindAsync(transactionId);
            if (transaction == null) return "failed"; // Không tìm thấy giao dịch

            if (transaction.Status == PaymentStatus.Pending)
            {
                if (vnp_ResponseCode == "00") // Thành công
                {
                    transaction.Status = PaymentStatus.Successful;
                    transaction.PaidDate = DateTime.UtcNow;
                    transaction.VnPayTransactionNo = vnp_TransactionNo;

                    // --- LOGIC GIA HẠN VIP ---
                    if (transaction.EmployerId.HasValue)
                    {
                        var employer = await _context.Employers.FindAsync(transaction.EmployerId);
                        if (employer != null)
                        {
                            employer.IsVip = true;

                            // Nếu chưa có ngày hết hạn hoặc đã hết hạn -> Tính từ hôm nay
                            if (!employer.VipExpireDate.HasValue || employer.VipExpireDate < DateTime.UtcNow)
                            {
                                employer.VipExpireDate = DateTime.UtcNow.AddDays(30);
                            }
                            else
                            {
                                // Nếu đang còn hạn -> Cộng thêm 30 ngày vào ngày hết hạn cũ
                                employer.VipExpireDate = employer.VipExpireDate.Value.AddDays(30);
                            }
                        }
                    }
                    else if (transaction.SeekerId.HasValue)
                    {
                        var seeker = await _context.Seekers.FindAsync(transaction.SeekerId);
                        if (seeker != null)
                        {
                            seeker.IsVip = true;

                            // Logic gia hạn tương tự cho Seeker
                            if (!seeker.VipExpireDate.HasValue || seeker.VipExpireDate < DateTime.UtcNow)
                            {
                                seeker.VipExpireDate = DateTime.UtcNow.AddDays(30);
                            }
                            else
                            {
                                seeker.VipExpireDate = seeker.VipExpireDate.Value.AddDays(30);
                            }
                        }
                    }
                    // -------------------------

                    await _context.SaveChangesAsync();
                    return "success";
                }
                else
                {
                    // Thất bại
                    transaction.Status = PaymentStatus.Failed;
                    await _context.SaveChangesAsync();
                    return "failed";
                }
            }

            return "success";
        }
        // ... (Các hàm khác giữ nguyên) ...

        // --- CÁC HÀM HELPER (BỔ TRỢ) ---

        private string GetIpAddress(HttpContext context)
        {
            try
            {
                var ip = context.Connection.RemoteIpAddress?.ToString();
                if (string.IsNullOrEmpty(ip) || ip == "::1") ip = "127.0.0.1";
                return ip;
            }
            catch
            {
                return "127.0.0.1";
            }
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

        private class VnPayCompare : IComparer<string>
        {
            public int Compare(string x, string y)
            {
                if (x == y) return 0;
                if (x == null) return -1;
                if (y == null) return 1;
                var compare = string.Compare(x, y, StringComparison.Ordinal);
                if (compare == 0) return 0;
                return compare;
            }
        }
    }
}