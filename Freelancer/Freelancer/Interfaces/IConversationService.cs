using Freelancer.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Freelancer.Interfaces
{
    public interface IConversationService
    {
        // API 1: Bắt đầu chat (trả về ID phòng chat)
        Task<int> StartConversationAsync(int currentUserId, int recipientUserId);

        // API 2: Lấy danh sách "Hộp thư"
        Task<IEnumerable<ConversationDto>> GetMyConversationsAsync(int currentUserId);

        // API 3: Lấy lịch sử tin nhắn (kèm kiểm tra quyền)
        Task<IEnumerable<MessageDto>> GetMessagesAsync(int conversationId, int currentUserId);
    }
}