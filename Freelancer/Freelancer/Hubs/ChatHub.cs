using Freelancer.Data; // Cần DbContext
using Freelancer.DTOs; // Cần MessageDto
using Freelancer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freelancer.Hubs
{
    [Authorize] // Bắt buộc đăng nhập
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;

        // Chúng ta sẽ tiêm (inject) DbContext vào Hub
        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- HÀM GỬI TIN NHẮN ---
        // (Frontend sẽ gọi hàm "SendMessage" này)
        // --- HÀM GỬI TIN NHẮN (ĐÃ CẬP NHẬT LOẠI) ---
        // type: "Text", "Image", "SharePost"...
        public async Task SendMessage(int conversationId, string content, string type = "Text")
        {
            // 1. Lấy ID người gửi (từ Token)
            var senderId = int.Parse(Context.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // 2. Kiểm tra xem người gửi có quyền trong phòng này không
            var hasAccess = await _context.ConversationUsers
                .AnyAsync(cu => cu.ConversationId == conversationId && cu.UserId == senderId);

            if (!hasAccess)
            {
                // Ném lỗi về cho người gửi
                await Clients.Caller.SendAsync("ReceiveError", "Bạn không có quyền gửi tin nhắn vào phòng này.");
                return;
            }

            // 3. Parse Enum (Hỗ trợ cả "File")
            if (!Enum.TryParse<MessageType>(type, true, out var messageType))
            {
                messageType = MessageType.Text;
            }


            // 4. Tạo Model Message
            var message = new Message
            {
                ConversationId = conversationId,
                SenderId = senderId,
                Content = content,
                Type = messageType, // <-- Lưu loại tin nhắn
                SentDate = System.DateTime.UtcNow,
                IsRead = false // Mới gửi, chưa đọc
            };

            // 5. Lưu vào Database
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // 6. Chuẩn bị DTO để gửi đi
            var sender = await _context.Users.FindAsync(senderId);
            var messageDto = new MessageDto
            {
                Id = message.Id,
                Content = message.Content,
                Type = message.Type.ToString(), // <-- Trả về loại tin nhắn
                SentDate = message.SentDate,
                IsRead = message.IsRead,
                SenderId = message.SenderId,
                SenderFullName = sender.FullName
            };

            // 7. Gửi tin nhắn đến NHỮNG NGƯỜI KHÁC trong phòng

            // Lấy ID của TẤT CẢ người tham gia (trừ mình)
            var participantIds = await _context.ConversationUsers
                .Where(cu => cu.ConversationId == conversationId)
                .Select(cu => cu.UserId.ToString()) // Phải là string
                .ToListAsync();

            // "Clients.Users(ids)" sẽ gửi đến các user ID cụ thể
            await Clients.Users(participantIds).SendAsync("ReceiveMessage", messageDto);
        }

        // Hàm này tự động chạy khi user kết nối
        public override async Task OnConnectedAsync()
        {
            // Lấy ID (từ Token)
            var userId = Context.User.FindFirst(ClaimTypes.NameIdentifier).Value;

            // "Groups" là một cách của SignalR
            // Chúng ta "Add" user vào 1 Group có tên = chính ID của họ
            // Để lát nữa chúng ta có thể gửi tin nhắn cho "Nhóm User 123"
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);

            await base.OnConnectedAsync();
        }


        // ... (Trong tệp Hubs/ChatHub.cs)
        // ... (Giữ nguyên hàm SendMessage và OnConnectedAsync)

        // --- THÊM HÀM MỚI NÀY VÀO CUỐI TỆP ---

        // (Frontend sẽ gọi hàm "MarkAsRead" này khi user MỞ phòng chat)
        public async Task MarkAsRead(int conversationId)
        {
            // 1. Lấy ID người đang xem (từ Token)
            var currentUserId = int.Parse(Context.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // 2. Tìm tất cả tin nhắn CHƯA ĐỌC trong phòng này
            //    mà KHÔNG PHẢI do mình gửi
            var unreadMessages = await _context.Messages
                .Where(m => m.ConversationId == conversationId &&
                            m.SenderId != currentUserId &&
                            !m.IsRead)
                .ToListAsync();

            if (!unreadMessages.Any())
            {
                return; // Không có gì để đánh dấu
            }

            // 3. Đánh dấu tất cả là ĐÃ ĐỌC
            foreach (var msg in unreadMessages)
            {
                msg.IsRead = true;
            }

            // 4. Lưu vào Database
            await _context.SaveChangesAsync();

            // 5. (Quan trọng) Thông báo "real-time" cho người gửi
            //    rằng tin nhắn của họ ĐÃ ĐƯỢC ĐỌC

            // Lấy ID của những người gửi (có thể chỉ là 1 người)
            var senderIds = unreadMessages
                .Select(m => m.SenderId.ToString())
                .Distinct()
                .ToList();

            // Gửi tín hiệu "MessagesRead" đến những người gửi đó
            // (Báo cho họ biết: "User [currentUserId] đã đọc tin nhắn trong phòng [conversationId]")
            await Clients.Users(senderIds).SendAsync("MessagesRead", conversationId, currentUserId);
        }
    }
}