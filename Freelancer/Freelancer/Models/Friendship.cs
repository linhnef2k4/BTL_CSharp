using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Freelancer.Models
{
    // Trạng thái của mối quan hệ
    public enum FriendshipStatus
    {
        Pending,  // Đang chờ chấp nhận
        Accepted, // Đã là bạn
        Rejected, // Đã từ chối
        Blocked   // (Có thể thêm sau)
    }

    public class Friendship
    {
        public int Id { get; set; } // ID của mối quan hệ

        // --- Người Gửi yêu cầu ---
        public int RequesterId { get; set; }
        [ForeignKey("RequesterId")]
        public virtual User Requester { get; set; }

        // --- Người Nhận yêu cầu ---
        public int ReceiverId { get; set; }
        [ForeignKey("ReceiverId")]
        public virtual User Receiver { get; set; }

        // --- Trạng thái ---
        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;
        public DateTime RequestedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ActionDate { get; set; } // Ngày chấp nhận/từ chối
    }
}