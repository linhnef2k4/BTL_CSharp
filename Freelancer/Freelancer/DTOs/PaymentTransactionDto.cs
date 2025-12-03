// Tạo file PaymentDtos.cs hoặc thêm vào file DTO hiện có
using System;

namespace Freelancer.DTOs
{
    public class PaymentTransactionDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string OrderInfo { get; set; }
        public string Status { get; set; } // Pending, Successful, Failed
        public DateTime CreatedDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public string VnPayTransactionNo { get; set; } // Mã giao dịch phía VNPay

        // Thông tin người trả tiền
        public string PayerName { get; set; }
        public string PayerEmail { get; set; }
        public string PayerType { get; set; } // "Employer" hoặc "Seeker"
    }
}