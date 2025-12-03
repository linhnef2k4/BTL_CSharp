using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Cần thiết để bắt DbUpdateException
using System; // Cần thiết cho Exception
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq; // Cần thiết cho FirstOrDefault

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        // --- HÀM HELPER: Lấy ID người dùng từ Token ---
        private int GetUserIdFromToken()
        {
            // Đảm bảo bạn đã thêm using System.Linq;
            // và đã kiểm tra tính tồn tại của Claim trước khi truy cập
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
            {
                // Xử lý trường hợp không tìm thấy Claim (dù đã Authorize)
                throw new UnauthorizedAccessException("Không tìm thấy User ID trong token.");
            }

            // Đảm bảo giá trị là int để khớp với EmployerId/SeekerId
            return int.Parse(userIdClaim.Value);
        }

        // --- API 1: TẠO LINK THANH TOÁN (CHO EMPLOYER) ---
        [HttpPost("create-vip-order")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> CreateVipOrder()
        {
            try
            {
                var employerId = GetUserIdFromToken();
                var paymentUrl = await _paymentService.CreateVipPaymentUrlAsync(employerId, HttpContext);

                return Ok(new { PaymentUrl = paymentUrl });
            }
            // BẮT LỖI CƠ SỞ DỮ LIỆU CHI TIẾT
            catch (DbUpdateException dbEx)
            {
                // Lấy ngoại lệ thấp nhất để xem chi tiết lỗi DB (ví dụ: NOT NULL, FOREIGN KEY)
                var innerEx = dbEx.InnerException;
                while (innerEx != null && innerEx.InnerException != null)
                {
                    innerEx = innerEx.InnerException;
                }

                string errorMessage = $"Lỗi DB: {innerEx?.Message}";

                // Ghi log lỗi chi tiết (Quan trọng cho Debug)
                System.Diagnostics.Debug.WriteLine(errorMessage);

                // Trả về lỗi 400 với thông báo lỗi chi tiết
                return BadRequest(errorMessage);
            }
            // Bắt các lỗi chung khác (như "Không tìm thấy Employer." từ Service)
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // --- API 2: NHẬN CALLBACK TỪ VNPAY ---
        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VnPayReturn()
        {
            try
            {
                var result = await _paymentService.ProcessVnPayReturnAsync(Request.Query);

                // Sau khi xử lý xong, chúng ta redirect trình duyệt
                // (Bạn sẽ cần đổi link localhost:3000 này thành link React/Frontend)
                if (result == "success")
                {
                    return Redirect("http://localhost:5173/payment/success");
                   
                }
                else
                {
                    return Redirect("http://localhost:5173/payment/failed");
                    
                }
            }
            catch (System.Exception ex)
            {
                //Ghi log lỗi nếu quá trình xử lý callback gặp sự cố
                //System.Diagnostics.Debug.WriteLine($"Lỗi xử lý VNPAY Callback: {ex.Message}");
                return Redirect("http://localhost:5173/payment/failed");
                
            }
        }

        // --- API 3: TẠO LINK THANH TOÁN (CHO SEEKER) ---
        [HttpPost("create-vip-order/seeker")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> CreateVipOrderForSeeker()
        {
            try
            {
                var seekerId = GetUserIdFromToken();
                var paymentUrl = await _paymentService.CreateVipPaymentUrlForSeekerAsync(seekerId, HttpContext);

                return Ok(new { PaymentUrl = paymentUrl });
            }
            // BẮT LỖI CƠ SỞ DỮ LIỆU CHI TIẾT
            catch (DbUpdateException dbEx)
            {
                var innerEx = dbEx.InnerException;
                while (innerEx != null && innerEx.InnerException != null)
                {
                    innerEx = innerEx.InnerException;
                }

                string errorMessage = $"Lỗi DB: {innerEx?.Message}";
                System.Diagnostics.Debug.WriteLine(errorMessage);

                return BadRequest(errorMessage);
            }
            // Bắt các lỗi chung khác
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/payment/check-status/{transactionId}
        [HttpGet("check-status/{transactionId}")]
        [Authorize] // Chỉ user đăng nhập mới được check
        public async Task<IActionResult> CheckTransactionStatus(int transactionId)
        {
            try
            {
                // Gọi Service QueryDR
                var result = await _paymentService.QueryTransactionStatusAsync(transactionId, HttpContext);

                return Ok(new { Message = result });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // --- API ADMIN: XEM TẤT CẢ GIAO DỊCH ---
        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")] // Chỉ Admin mới được xem doanh thu
        public async Task<IActionResult> GetAllPayments()
        {
            try
            {
                var transactions = await _paymentService.GetAllTransactionsAsync();
                return Ok(transactions);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // ...

        // --- API 4: HOÀN TIỀN (REFUND) ---
        // POST: api/payment/refund/{transactionId}
        [HttpPost("refund/{transactionId}")]
        [Authorize(Roles = "Admin")] // BẮT BUỘC LÀ ADMIN
        public async Task<IActionResult> RefundTransaction(int transactionId)
        {
            try
            {
                // Lấy tên Admin đang đăng nhập để ghi log cho VNPay
                string adminName = User.Identity.Name ?? "Admin";

                var result = await _paymentService.RefundTransactionAsync(transactionId, adminName, HttpContext);

                if (result.Contains("thành công"))
                {
                    return Ok(new { Message = result });
                }
                else
                {
                    return BadRequest(new { Error = result });
                }
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}