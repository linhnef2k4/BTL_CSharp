using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    public enum PaymentStatus
    {
        Pending,
        Successful,
        Failed
    }

    public class PaymentTransaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // ✅ ĐÃ SỬA: Dùng int? để cho phép NULL trong DB
        public int? EmployerId { get; set; }
        [ForeignKey("EmployerId")]
        public virtual Employer Employer { get; set; }

        public int? SeekerId { get; set; }
        [ForeignKey("SeekerId")]
        public virtual Seeker Seeker { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Amount { get; set; }

        public string PaymentMethod { get; set; } = "VNPay";

        [Required]
        [MaxLength(255)] // Đảm bảo độ dài này đủ lớn
        public string OrderInfo { get; set; }

        [Required]
        // KHÔNG CÓ giá trị mặc định, giá trị sẽ được gán trong Service
        public DateTime CreatedDate { get; set; }

        public DateTime? PaidDate { get; set; }

        [Required]
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public string? VnPayTransactionNo { get; set; }
    }
}