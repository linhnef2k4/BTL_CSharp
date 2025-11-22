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
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = Guid.NewGuid().ToString(); // Mã giao dịch duy nhất

        // --- SỬA ĐỔI Ở ĐÂY ---
        // Không bắt buộc EmployerId nữa
        public int? EmployerId { get; set; }
        [ForeignKey("EmployerId")]
        public virtual Employer Employer { get; set; }

        // Thêm SeekerId (cũng nullable)
        public int? SeekerId { get; set; }
        [ForeignKey("SeekerId")]
        public virtual Seeker Seeker { get; set; }
        // --- KẾT THÚC SỬA ---

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