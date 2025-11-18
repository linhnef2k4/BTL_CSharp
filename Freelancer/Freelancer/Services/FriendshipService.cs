using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Freelancer.Services
{
    public class FriendshipService : IFriendshipService
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public FriendshipService(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService; // <-- Gán
        }

        // --- GỬI YÊU CẦU ---
        public async Task<string> SendFriendRequestAsync(int currentUserId, int receiverId)
        {
            if (currentUserId == receiverId)
            {
                return "Bạn không thể tự kết bạn với chính mình.";
            }

            // Kiểm tra xem đã tồn tại mối quan hệ (theo cả 2 chiều) chưa
            var existing = await _context.Friendships
                .AnyAsync(f => (f.RequesterId == currentUserId && f.ReceiverId == receiverId) ||
                               (f.RequesterId == receiverId && f.ReceiverId == currentUserId));

            if (existing)
            {
                return "Yêu cầu đã được gửi hoặc hai bạn đã là bạn bè.";
            }

            // Tạo yêu cầu mới
            var newRequest = new Friendship
            {
                RequesterId = currentUserId,
                ReceiverId = receiverId,
                Status = FriendshipStatus.Pending
            };

            _context.Friendships.Add(newRequest);
            await _context.SaveChangesAsync();
            // --- (PHẦN NÂNG CẤP) TẠO THÔNG BÁO ---
            try
            {
                // Tạo thông báo cho Người Nhận Yêu Cầu (Recipient)
                await _notificationService.CreateNotificationAsync(
                    recipientId: receiverId,
                    actorId: currentUserId, // Người Gửi (Actor)
                    message: "đã gửi cho bạn một lời mời kết bạn.",
                    linkUrl: $"/friends/pending" // Link tới trang "Yêu cầu đang chờ"
                );
            }
            catch (System.Exception) { /* Lỗi gửi thông báo */ }
            // --- (KẾT THÚC NÂNG CẤP) ---
            return null; // Thành công
        }

        // --- CHẤP NHẬN YÊU CẦU ---
        public async Task<bool> AcceptFriendRequestAsync(int friendshipId, int currentUserId)
        {
            // Tìm yêu cầu, VÀ đảm bảo MÌNH LÀ NGƯỜI NHẬN
            var request = await _context.Friendships
                .FirstOrDefaultAsync(f => f.Id == friendshipId &&
                                      f.ReceiverId == currentUserId &&
                                      f.Status == FriendshipStatus.Pending);

            if (request == null) return false; // Không tìm thấy yêu cầu

            request.Status = FriendshipStatus.Accepted;
            request.ActionDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();


            // --- (PHẦN NÂNG CẤP) TẠO THÔNG BÁO ---
            try
            {
                // Tạo thông báo cho Người Gửi Yêu Cầu (Recipient)
                await _notificationService.CreateNotificationAsync(
                    recipientId: request.RequesterId,
                    actorId: currentUserId, // Người Chấp Nhận (Actor)
                    message: "đã chấp nhận lời mời kết bạn của bạn.",
                    linkUrl: $"/profile/{currentUserId}" // Link tới profile của người chấp nhận
                );
            }
            catch (System.Exception) { /* Lỗi gửi thông báo */ }
            // --- (KẾT THÚC NÂNG CẤP) ---
            return true;
        }

        // --- TỪ CHỐI YÊU CẦU ---
        public async Task<bool> RejectFriendRequestAsync(int friendshipId, int currentUserId)
        {
            var request = await _context.Friendships
                .FirstOrDefaultAsync(f => f.Id == friendshipId &&
                                      f.ReceiverId == currentUserId &&
                                      f.Status == FriendshipStatus.Pending);

            if (request == null) return false;

            request.Status = FriendshipStatus.Rejected;
            request.ActionDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        // --- LẤY DANH SÁCH YÊU CẦU ĐANG CHỜ ---
        public async Task<IEnumerable<FriendRequestDto>> GetPendingRequestsAsync(int currentUserId)
        {
            var requests = await _context.Friendships
                .Where(f => f.ReceiverId == currentUserId && f.Status == FriendshipStatus.Pending)
                .Include(f => f.Requester) // Lấy User gửi
                    .ThenInclude(u => u.Seeker) // Lấy Seeker (để lấy Headline)
                .OrderByDescending(f => f.RequestedDate)
                .ToListAsync();

            return requests.Select(f => new FriendRequestDto
            {
                FriendshipId = f.Id,
                RequesterId = f.RequesterId,
                RequesterFullName = f.Requester.FullName,
                RequesterHeadline = f.Requester.Seeker?.Headline ?? "Thành viên"
            });
        }

        // --- LẤY DANH SÁCH BẠN BÈ ---
        public async Task<IEnumerable<FriendDto>> GetFriendsAsync(int currentUserId)
        {
            // Bạn bè là người (mình gửi hoặc họ gửi) có Status = Accepted
            var friendships = await _context.Friendships
                .Where(f => (f.RequesterId == currentUserId || f.ReceiverId == currentUserId)
                            && f.Status == FriendshipStatus.Accepted)
                .Include(f => f.Requester).ThenInclude(u => u.Seeker)
                .Include(f => f.Receiver).ThenInclude(u => u.Seeker)
                .ToListAsync();

            var friendDtos = new List<FriendDto>();
            foreach (var f in friendships)
            {
                // Lấy thông tin của "NGƯỜI KIA" (không phải mình)
                var otherUser = (f.RequesterId == currentUserId) ? f.Receiver : f.Requester;

                friendDtos.Add(new FriendDto
                {
                    FriendId = otherUser.Id,
                    FriendFullName = otherUser.FullName,
                    FriendHeadline = otherUser.Seeker?.Headline ?? "Thành viên",
                    FriendEmail = otherUser.Email
                });
            }
            return friendDtos;
        }


        public async Task<IEnumerable<UserSearchDto>> SearchUsersAsync(int currentUserId, string searchQuery)
        {
            // 1. Bắt đầu tìm kiếm
            var queryable = _context.Users
                .Include(u => u.Seeker)
                .AsQueryable();

            // 2. Lọc theo Tên HOẶC Email
            if (!string.IsNullOrEmpty(searchQuery))
            {
                bool isEmailSearch = searchQuery.Contains("@");

                if (isEmailSearch)
                {
                    // Nếu là email, tìm CHÍNH XÁC
                    queryable = queryable.Where(u => u.Email == searchQuery);
                }
                else
                {
                    // Nếu là tên, tìm GẦN ĐÚNG
                    queryable = queryable.Where(u => u.FullName.ToLower().Contains(searchQuery.ToLower()));
                }
            }
            else
            {
                // Nếu không có query, trả về danh sách rỗng
                return new List<UserSearchDto>();
            }

            // 3. Lọc BỎ CHÍNH MÌNH (Đúng như ý bạn!)
            queryable = queryable.Where(u => u.Id != currentUserId);

            // 4. Chạy query và Map sang DTO
            var users = await queryable
                .Take(20) // Lấy 20 kết quả
                .ToListAsync();

            return users.Select(u => new UserSearchDto
            {
                UserId = u.Id,
                FullName = u.FullName,
                Headline = u.Seeker?.Headline ?? "Thành viên",
                Role = u.Role
            });
        }
    }
}