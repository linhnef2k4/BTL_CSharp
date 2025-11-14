using Freelancer.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Freelancer.Interfaces
{
    public interface INotificationService
    {
        // --- Hàm TẠO (cho Phần B) ---
        // (Hàm này các Service khác sẽ gọi)
        Task CreateNotificationAsync(int recipientId, int? actorId, string message, string linkUrl);

        // --- Hàm ĐỌC (cho Phần A) ---
        Task<IEnumerable<NotificationDto>> GetMyNotificationsAsync(int currentUserId);

        // (Chúng ta sẽ làm thêm hàm "Đánh dấu đã đọc" sau)
    }
}