using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        // (Constructor này không cần IVnpayService)
        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        // Hàm helper lấy ID (copy từ controller khác)
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
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

                // Trả về link cho Frontend
                return Ok(new { PaymentUrl = paymentUrl });
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // --- API 2: NHẬN CALLBACK TỪ VNPAY ---
        // (API này VNPay gọi, KHÔNG cần Authorize)
        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VnPayReturn()
        {
            var result = await _paymentService.ProcessVnPayReturnAsync(Request.Query);

            // Sau khi xử lý xong, chúng ta redirect trình duyệt
            // của User về trang "Kết quả" của Frontend

            // (Bạn sẽ cần đổi link localhost:3000 này thành link React/Frontend)
            if (result == "success")
            {
                return Redirect("http://localhost:3000/payment/success");
            }
            else
            {
                return Redirect("http://localhost:3000/payment/failed");
            }
        }

        // --- API 3: TẠO LINK THANH TOÁN (CHO SEEKER) ---
        [HttpPost("create-vip-order/seeker")] // POST /api/payment/create-vip-order/seeker
        [Authorize(Roles = "Seeker")] // Chỉ Seeker
        public async Task<IActionResult> CreateVipOrderForSeeker()
        {
            try
            {
                var seekerId = GetUserIdFromToken(); // ID của Seeker cũng là UserId
                var paymentUrl = await _paymentService.CreateVipPaymentUrlForSeekerAsync(seekerId, HttpContext);

                return Ok(new { PaymentUrl = paymentUrl });
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}