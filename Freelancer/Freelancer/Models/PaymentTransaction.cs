using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public enum PaymentStatus
    {
        Pending,   // Đang chờ
        Successful, // Thành công
        Failed     // Thất bại
    }

    public class PaymentTransaction
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString(); // Mã giao dịch duy nhất

        [Required]
        public int EmployerId { get; set; } // Ai là người thanh toán
        [ForeignKey("EmployerId")]
        public virtual Employer Employer { get; set; }

        public decimal Amount { get; set; } // Số tiền
        public string PaymentMethod { get; set; } = "VNPay";
        public string OrderInfo { get; set; } // "Nang cap VIP"
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? PaidDate { get; set; } // Ngày thanh toán

        [Required]
        // --- DÒNG SỬA LỖI ĐÂY (Dấu } phải ở trước dấu =) ---
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        // Mã giao dịch từ phía VNPay (nếu có)
        public string? VnPayTransactionNo { get; set; }
    }
}