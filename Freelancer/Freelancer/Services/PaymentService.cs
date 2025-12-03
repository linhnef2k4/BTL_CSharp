using Freelancer.Data;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Freelancer.DTOs;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
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


        public async Task<string> QueryTransactionStatusAsync(int transactionId, HttpContext httpContext)
        {
            // 1. Lấy giao dịch từ DB
            var transaction = await _context.PaymentTransactions.FindAsync(transactionId);
            if (transaction == null) return "Transaction not found";

            // 2. Cấu hình tham số QueryDR
            string vnp_ApiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
            string vnp_TmnCode = _config["VnPay:TmnCode"];
            string vnp_HashSecret = _config["VnPay:HashSecret"];
            string vnp_RequestId = Guid.NewGuid().ToString(); // Mã định danh request (duy nhất)
            string vnp_Version = "2.1.0";
            string vnp_Command = "querydr";
            string vnp_TxnRef = transaction.Id.ToString(); // Mã giao dịch của mình
            string vnp_OrderInfo = "Query transaction " + transaction.Id;

            // VNPay yêu cầu ngày tạo giao dịch (phải đúng y hệt lúc tạo link thanh toán)
            string vnp_TransactionDate = transaction.CreatedDate.ToString("yyyyMMddHHmmss");
            string vnp_CreateDate = DateTime.Now.ToString("yyyyMMddHHmmss"); // Thời gian gọi API này
            string vnp_IpAddr = GetIpAddress(httpContext);

            // 3. Tính Checksum (Lưu ý: QueryDR dùng dấu "|" để nối, KHÔNG sắp xếp alphabet)
            // Quy tắc: requestId|version|command|tmnCode|txnRef|transDate|createDate|ipAddr|orderInfo
            string rawData = $"{vnp_RequestId}|{vnp_Version}|{vnp_Command}|{vnp_TmnCode}|{vnp_TxnRef}|{vnp_TransactionDate}|{vnp_CreateDate}|{vnp_IpAddr}|{vnp_OrderInfo}";
            string vnp_SecureHash = HmacSHA512(vnp_HashSecret, rawData);

            // 4. Tạo JSON Body
            var requestData = new
            {
                vnp_RequestId = vnp_RequestId,
                vnp_Version = vnp_Version,
                vnp_Command = vnp_Command,
                vnp_TmnCode = vnp_TmnCode,
                vnp_TxnRef = vnp_TxnRef,
                vnp_OrderInfo = vnp_OrderInfo,
                vnp_TransactionDate = vnp_TransactionDate,
                vnp_CreateDate = vnp_CreateDate,
                vnp_IpAddr = vnp_IpAddr,
                vnp_SecureHash = vnp_SecureHash
            };

            // 5. Gửi Request POST đến VNPay
            using (var client = new HttpClient())
            {
                var json = JsonConvert.SerializeObject(requestData);
                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync(vnp_ApiUrl, httpContent);
                var responseString = await response.Content.ReadAsStringAsync();

                // 6. Xử lý kết quả trả về
                var jsonResponse = JObject.Parse(responseString);
                string responseCode = jsonResponse["vnp_ResponseCode"]?.ToString();
                string transactionStatus = jsonResponse["vnp_TransactionStatus"]?.ToString();

                if (responseCode == "00" && transactionStatus == "00")
                {
                    // Giao dịch thành công tại VNPay
                    if (transaction.Status == PaymentStatus.Pending)
                    {
                        // Cập nhật DB của mình
                        transaction.Status = PaymentStatus.Successful;
                        transaction.PaidDate = DateTime.UtcNow;
                        transaction.VnPayTransactionNo = jsonResponse["vnp_TransactionNo"]?.ToString();

                        // GỌI HÀM CẬP NHẬT VIP (Giống logic trong ProcessVnPayReturnAsync)
                        await UpdateVipStatus(transaction);

                        await _context.SaveChangesAsync();
                        return "Success: Transaction confirmed.";
                    }
                    return "Success: Already updated.";
                }
                else
                {
                    return $"Failed: Code {responseCode}, Status {transactionStatus}, Msg: {jsonResponse["vnp_Message"]}";
                }
            }
        }

        // Hàm phụ để cập nhật VIP (tách ra để dùng chung cho gọn)
        private async Task UpdateVipStatus(PaymentTransaction transaction)
        {
            if (transaction.EmployerId.HasValue)
            {
                var employer = await _context.Employers.FindAsync(transaction.EmployerId);
                if (employer != null)
                {
                    employer.IsVip = true;
                    if (!employer.VipExpireDate.HasValue || employer.VipExpireDate < DateTime.UtcNow)
                        employer.VipExpireDate = DateTime.UtcNow.AddDays(30);
                    else
                        employer.VipExpireDate = employer.VipExpireDate.Value.AddDays(30);
                }
            }
            else if (transaction.SeekerId.HasValue)
            {
                var seeker = await _context.Seekers.FindAsync(transaction.SeekerId);
                if (seeker != null)
                {
                    seeker.IsVip = true;
                    if (!seeker.VipExpireDate.HasValue || seeker.VipExpireDate < DateTime.UtcNow)
                        seeker.VipExpireDate = DateTime.UtcNow.AddDays(30);
                    else
                        seeker.VipExpireDate = seeker.VipExpireDate.Value.AddDays(30);
                }
            }
        }
        public async Task<IEnumerable<PaymentTransactionDto>> GetAllTransactionsAsync()
        {
            // BƯỚC 1: Lấy danh sách giao dịch thô (KHÔNG Include gì cả để chắc chắn lấy được dữ liệu)
            var transactions = await _context.PaymentTransactions
                .OrderByDescending(t => t.CreatedDate)
                .AsNoTracking()
                .ToListAsync();

            // Nếu không có giao dịch nào thì trả về luôn
            if (!transactions.Any()) return new List<PaymentTransactionDto>();

            // BƯỚC 2: Lấy danh sách ID của Employer và Seeker có trong các giao dịch trên
            var employerIds = transactions.Where(t => t.EmployerId.HasValue).Select(t => t.EmployerId.Value).Distinct().ToList();
            var seekerIds = transactions.Where(t => t.SeekerId.HasValue).Select(t => t.SeekerId.Value).Distinct().ToList();

            // BƯỚC 3: Truy vấn thông tin Employer và Seeker (Kèm User) để lấy tên
            // Chỉ lấy những người có trong danh sách ID ở trên (Tối ưu hiệu năng)
            var employers = await _context.Employers
                .Where(e => employerIds.Contains(e.Id))
                .Include(e => e.User) // Lấy User để lấy Email
                .ToDictionaryAsync(e => e.Id); // Chuyển sang Dictionary để tra cứu cho nhanh

            var seekers = await _context.Seekers
                .Where(s => seekerIds.Contains(s.Id))
                .Include(s => s.User)
                .ToDictionaryAsync(s => s.Id);

            // BƯỚC 4: Ghép thông tin (Mapping)
            var result = transactions.Select(t =>
            {
                string name = "Không xác định";
                string email = "Ẩn";
                string type = "Unknown";

                // Thử tìm trong danh sách Employer đã tải về
                if (t.EmployerId.HasValue && employers.ContainsKey(t.EmployerId.Value))
                {
                    var emp = employers[t.EmployerId.Value];
                    type = "Employer";
                    name = emp.CompanyName ?? "Công ty (Lỗi tên)";
                    email = emp.User?.Email ?? "Email ẩn";
                }
                // Thử tìm trong danh sách Seeker đã tải về
                else if (t.SeekerId.HasValue && seekers.ContainsKey(t.SeekerId.Value))
                {
                    var sk = seekers[t.SeekerId.Value];
                    type = "Seeker";
                    name = sk.User?.FullName ?? "Ứng viên (Lỗi tên)";
                    email = sk.User?.Email ?? "Email ẩn";
                }

                return new PaymentTransactionDto
                {
                    Id = t.Id,
                    Amount = t.Amount,
                    OrderInfo = t.OrderInfo,
                    Status = t.Status.ToString(),
                    CreatedDate = t.CreatedDate,
                    PaidDate = t.PaidDate,
                    VnPayTransactionNo = t.VnPayTransactionNo,

                    PayerName = name,
                    PayerType = type,
                    PayerEmail = email
                };
            });

            return result;
        }

        // ... (Giữ nguyên các using cũ)

        // --- THÊM HÀM MỚI VÀO PaymentService ---
        public async Task<string> RefundTransactionAsync(int transactionId, string adminUser, HttpContext httpContext)
        {
            // 1. Lấy thông tin giao dịch từ DB
            var transaction = await _context.PaymentTransactions.FindAsync(transactionId);

            if (transaction == null) return "Không tìm thấy giao dịch.";
            if (transaction.Status != PaymentStatus.Successful) return "Giao dịch chưa thành công hoặc đã hoàn tiền.";
            if (string.IsNullOrEmpty(transaction.VnPayTransactionNo)) return "Thiếu mã giao dịch VNPay (VnPayTransactionNo).";

            // 2. Cấu hình tham số Refund
            // Lưu ý: URL Refund KHÁC với URL QueryDR
            string vnp_ApiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";

            string vnp_RequestId = Guid.NewGuid().ToString(); // Mã duy nhất cho yêu cầu hoàn tiền
            string vnp_Version = "2.1.0";
            string vnp_Command = "refund";
            string vnp_TmnCode = _config["VnPay:TmnCode"];
            string vnp_HashSecret = _config["VnPay:HashSecret"];
            string vnp_TxnRef = transaction.Id.ToString(); // Mã đơn hàng cũ
            string vnp_Amount = ((long)transaction.Amount * 100).ToString(); // Số tiền hoàn (nhân 100)
            string vnp_OrderInfo = "Hoan tien giao dich " + transaction.Id;
            string vnp_TransactionDate = transaction.CreatedDate.ToString("yyyyMMddHHmmss"); // Ngày đơn hàng cũ
            string vnp_CreateDate = DateTime.Now.ToString("yyyyMMddHHmmss"); // Ngày tạo lệnh hoàn
            string vnp_IpAddr = GetIpAddress(httpContext);
            string vnp_TransactionType = "02"; // 02: Hoàn toàn bộ, 03: Hoàn một phần

            // 3. Tạo Checksum (SecureHash)
            // Quy tắc tạo Hash Refund:
            // requestId|version|command|tmnCode|transactionType|txnRef|amount|transactionNo|transactionDate|createBy|createDate|ipAddr|orderInfo
            string rawData = $"{vnp_RequestId}|{vnp_Version}|{vnp_Command}|{vnp_TmnCode}|{vnp_TransactionType}|{vnp_TxnRef}|{vnp_Amount}|{transaction.VnPayTransactionNo}|{vnp_TransactionDate}|{adminUser}|{vnp_CreateDate}|{vnp_IpAddr}|{vnp_OrderInfo}";

            string vnp_SecureHash = HmacSHA512(vnp_HashSecret, rawData);

            // 4. Tạo JSON Request
            var requestData = new
            {
                vnp_RequestId = vnp_RequestId,
                vnp_Version = vnp_Version,
                vnp_Command = vnp_Command,
                vnp_TmnCode = vnp_TmnCode,
                vnp_TransactionType = vnp_TransactionType,
                vnp_TxnRef = vnp_TxnRef,
                vnp_Amount = vnp_Amount,
                vnp_TransactionNo = transaction.VnPayTransactionNo, // Quan trọng
                vnp_TransactionDate = vnp_TransactionDate,
                vnp_CreateBy = adminUser,
                vnp_CreateDate = vnp_CreateDate,
                vnp_IpAddr = vnp_IpAddr,
                vnp_OrderInfo = vnp_OrderInfo,
                vnp_SecureHash = vnp_SecureHash
            };

            // 5. Gửi Request tới VNPay
            using (var client = new HttpClient())
            {
                var json = JsonConvert.SerializeObject(requestData);
                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync(vnp_ApiUrl, httpContent);
                var responseString = await response.Content.ReadAsStringAsync();

                // 6. Xử lý phản hồi
                var jsonResponse = JObject.Parse(responseString);
                string responseCode = jsonResponse["vnp_ResponseCode"]?.ToString();

                if (responseCode == "00")
                {
                    // --- THÀNH CÔNG ---
                    // Cập nhật trạng thái trong DB
                    transaction.Status = PaymentStatus.Refunded; // Bạn cần thêm Enum này hoặc dùng Failed

                    // THU HỒI VIP (Quan trọng)
                    await RevokeVip(transaction);

                    await _context.SaveChangesAsync();
                    return "Hoàn tiền thành công.";
                }
                else
                {
                    string msg = jsonResponse["vnp_Message"]?.ToString() ?? "Lỗi không xác định";
                    return $"Lỗi VNPay: {responseCode} - {msg}";
                }
            }
        }

        // Hàm phụ để thu hồi VIP (Ngược lại với UpdateVipStatus)
        private async Task RevokeVip(PaymentTransaction transaction)
        {
            if (transaction.EmployerId.HasValue)
            {
                var employer = await _context.Employers.FindAsync(transaction.EmployerId);
                if (employer != null)
                {
                    employer.IsVip = false;
                    // employer.VipExpireDate giữ nguyên hoặc xóa tùy bạn
                }
            }
            else if (transaction.SeekerId.HasValue)
            {
                var seeker = await _context.Seekers.FindAsync(transaction.SeekerId);
                if (seeker != null)
                {
                    seeker.IsVip = false;
                }
            }
        }


    }
}