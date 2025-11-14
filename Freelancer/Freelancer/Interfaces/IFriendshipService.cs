using Freelancer.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Freelancer.Interfaces
{
    public interface IFriendshipService
    {
        // Gửi yêu cầu (trả về lỗi nếu có)
        Task<string> SendFriendRequestAsync(int currentUserId, int receiverId);

        // Chấp nhận
        Task<bool> AcceptFriendRequestAsync(int friendshipId, int currentUserId);

        // Từ chối
        Task<bool> RejectFriendRequestAsync(int friendshipId, int currentUserId);

        // Lấy danh sách yêu cầu đang chờ
        Task<IEnumerable<FriendRequestDto>> GetPendingRequestsAsync(int currentUserId);

        // Lấy danh sách bạn bè
        Task<IEnumerable<FriendDto>> GetFriendsAsync(int currentUserId);
    }
}