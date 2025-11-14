using Freelancer.Data;
using Freelancer.DTOs;
using Freelancer.Interfaces;
using Freelancer.Models;
using Microsoft.EntityFrameworkCore;

namespace Freelancer.Services
{
    public class SocialPostService : ISocialPostService
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public SocialPostService(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService; // <-- Gán
        }

        public async Task<SocialPostDto> CreatePostAsync(int authorId, CreateSocialPostDto request)
        {
            // 1. Tạo Model
            var newPost = new SocialPost
            {
                Content = request.Content,
                ImageUrl = request.ImageUrl,
                AuthorId = authorId,
                CreatedDate = DateTime.UtcNow
            };

            // 2. Lưu vào DB
            _context.SocialPosts.Add(newPost);
            await _context.SaveChangesAsync();

            // 3. Lấy thông tin đầy đủ để trả về (hơi tốn kém nhưng đơn giản)
            // (Chúng ta cần thông tin Author để trả về)
            var author = await _context.Users
                                .Include(u => u.Seeker)
                                .FirstOrDefaultAsync(u => u.Id == authorId);

            // 4. Map sang DTO
            return new SocialPostDto
            {
                Id = newPost.Id,
                Content = newPost.Content,
                ImageUrl = newPost.ImageUrl,
                CreatedDate = newPost.CreatedDate,
                AuthorId = author.Id,
                AuthorFullName = author.FullName,
                AuthorHeadline = author.Seeker?.Headline ?? "Thành viên" // Lấy headline
            };
        }

        // (Nhớ thêm using System.Linq; và System.Collections.Generic; nếu chưa có)

        public async Task<IEnumerable<SocialPostDto>> GetFeedAsync(int? currentUserId)
        {
            // 1. Lấy các bài post (giống như cũ)
            var posts = await _context.SocialPosts
                .Include(post => post.Author)
                    .ThenInclude(author => author.Seeker)
                .OrderByDescending(post => post.CreatedDate)
                .Take(50)
                .ToListAsync();

            if (!posts.Any())
            {
                return new List<SocialPostDto>(); // Trả về list rỗng
            }

            // Lấy danh sách ID của 50 bài post này
            var postIds = posts.Select(p => p.Id).ToList();

            // 2. Lấy TỔNG SỐ COMMENT cho 50 bài post (Chỉ 1 query)
            var commentCounts = await _context.SocialPostComments
                .Where(c => postIds.Contains(c.PostId))
                .GroupBy(c => c.PostId)
                .Select(g => new { PostId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.PostId, x => x.Count);

            // 3. Lấy SỐ LƯỢNG CẢM XÚC (Like, Love...) cho 50 bài post (Chỉ 1 query)
            var reactionCountsList = await _context.SocialPostReactions
                .Where(r => postIds.Contains(r.PostId))
                .GroupBy(r => new { r.PostId, r.ReactionType })
                .Select(g => new
                {
                    PostId = g.Key.PostId,
                    ReactionType = g.Key.ReactionType,
                    Count = g.Count()
                })
                .ToListAsync();

            // 4. Lấy CẢM XÚC CỦA TÔI (MyReaction) (Chỉ 1 query, nếu đã đăng nhập)
            var myReactions = new Dictionary<int, string>();
            if (currentUserId.HasValue)
            {
                myReactions = await _context.SocialPostReactions
                    .Where(r => postIds.Contains(r.PostId) && r.UserId == currentUserId.Value)
                    .ToDictionaryAsync(x => x.PostId, x => x.ReactionType);
            }

            // 5. "Ghép" tất cả dữ liệu lại
            var resultDtos = new List<SocialPostDto>();
            foreach (var post in posts)
            {
                // Lấy ReactionCounts của post này
                var postReactionCounts = reactionCountsList
                    .Where(r => r.PostId == post.Id)
                    .ToDictionary(r => r.ReactionType, r => r.Count);

                resultDtos.Add(new SocialPostDto
                {
                    Id = post.Id,
                    Content = post.Content,
                    ImageUrl = post.ImageUrl,
                    CreatedDate = post.CreatedDate,
                    AuthorId = post.Author.Id,
                    AuthorFullName = post.Author.FullName,
                    AuthorHeadline = post.Author.Seeker?.Headline ?? "Thành viên",

                    // --- Gán dữ liệu mới ---
                    // 1. Gán tổng số comment (nếu không có thì = 0)
                    CommentCount = commentCounts.ContainsKey(post.Id) ? commentCounts[post.Id] : 0,

                    // 2. Gán dictionary đếm cảm xúc
                    ReactionCounts = postReactionCounts,

                    // 3. Gán cảm xúc của tôi (nếu không có thì = null)
                    MyReaction = myReactions.ContainsKey(post.Id) ? myReactions[post.Id] : null
                });
            }

            return resultDtos;
        }


        // --- THÊM 2 HÀM MỚI VÀO CUỐI TỆP ---

        public async Task<CommentDto> PostCommentAsync(int postId, int authorId, CreateCommentDto request)
        {
            // 1. SỬA: Lấy bài post (thay vì chỉ kiểm tra "Exists")
            var post = await _context.SocialPosts.FindAsync(postId);
            if (post == null)
            {
                return null; // Không tìm thấy bài post
            }

            // 2. Tạo model Comment (giữ nguyên)
            var newComment = new SocialPostComment
            {
                Content = request.Content,
                AuthorId = authorId,
                PostId = postId,
                CreatedDate = DateTime.UtcNow
            };

            _context.SocialPostComments.Add(newComment);
            await _context.SaveChangesAsync(); // <-- Đã lưu

            // --- (PHẦN NÂNG CẤP) TẠO THÔNG BÁO (NẾU LÀ BẠN BÈ) ---
            try
            {
                // 3. Kiểm tra: Không tự thông báo cho chính mình
                if (post.AuthorId != authorId)
                {
                    // 4. KIỂM TRA BẠN BÈ (Logic quan trọng)
                    bool areFriends = await _context.Friendships
                        .AnyAsync(f =>
                            (f.RequesterId == post.AuthorId && f.ReceiverId == authorId && f.Status == FriendshipStatus.Accepted) ||
                            (f.RequesterId == authorId && f.ReceiverId == post.AuthorId && f.Status == FriendshipStatus.Accepted)
                        );

                    // 5. Nếu là bạn, gửi thông báo
                    if (areFriends)
                    {
                        var author = await _context.Users.FindAsync(authorId); // Lấy tên người comment
                        await _notificationService.CreateNotificationAsync(
                            recipientId: post.AuthorId, // Gửi cho chủ post
                            actorId: authorId,          // Người comment
                            message: $"đã bình luận về bài viết của bạn.",
                            linkUrl: $"/posts/{post.Id}" // Link tới bài post
                        );
                    }
                }
            }
            catch (System.Exception) { /* Lỗi gửi thông báo */ }
            // --- (KẾT THÚC NÂNG CẤP) ---

            // 6. Lấy thông tin tác giả để trả về DTO (giữ nguyên)
            var commentAuthor = await _context.Users
                                .Include(u => u.Seeker)
                                .FirstOrDefaultAsync(u => u.Id == authorId);

            // 7. Map sang DTO (giữ nguyên)
            return new CommentDto
            {
                Id = newComment.Id,
                Content = newComment.Content,
                CreatedDate = newComment.CreatedDate,
                AuthorId = commentAuthor.Id,
                AuthorFullName = commentAuthor.FullName,
                AuthorHeadline = commentAuthor.Seeker?.Headline ?? "Thành viên"
            };
        }

        // (Nhớ thêm using System.Linq; và System.Collections.Generic; nếu chưa có)

        public async Task<IEnumerable<CommentDto>> GetCommentsAsync(int postId, int? currentUserId)
        {
            // 1. Lấy các comment (giống như cũ)
            var comments = await _context.SocialPostComments
                .Where(c => c.PostId == postId)
                .Include(c => c.Author)
                    .ThenInclude(author => author.Seeker)
                .OrderBy(c => c.CreatedDate)
                .ToListAsync();

            if (!comments.Any())
            {
                return new List<CommentDto>(); // Trả về list rỗng
            }

            // Lấy danh sách ID của các comment này
            var commentIds = comments.Select(c => c.Id).ToList();

            // 2. Lấy SỐ LƯỢNG CẢM XÚC cho các comment (Chỉ 1 query)
            var reactionCountsList = await _context.SocialCommentReactions
                .Where(r => commentIds.Contains(r.CommentId))
                .GroupBy(r => new { r.CommentId, r.ReactionType })
                .Select(g => new
                {
                    CommentId = g.Key.CommentId,
                    ReactionType = g.Key.ReactionType,
                    Count = g.Count()
                })
                .ToListAsync();

            // 3. Lấy CẢM XÚC CỦA TÔI (MyReaction) (Chỉ 1 query, nếu đã đăng nhập)
            var myReactions = new Dictionary<int, string>();
            if (currentUserId.HasValue)
            {
                myReactions = await _context.SocialCommentReactions
                    .Where(r => commentIds.Contains(r.CommentId) && r.UserId == currentUserId.Value)
                    .ToDictionaryAsync(x => x.CommentId, x => x.ReactionType);
            }

            // 4. "Ghép" tất cả dữ liệu lại
            var resultDtos = new List<CommentDto>();
            foreach (var comment in comments)
            {
                // Lấy ReactionCounts của comment này
                var commentReactionCounts = reactionCountsList
                    .Where(r => r.CommentId == comment.Id)
                    .ToDictionary(r => r.ReactionType, r => r.Count);

                resultDtos.Add(new CommentDto
                {
                    Id = comment.Id,
                    Content = comment.Content,
                    CreatedDate = comment.CreatedDate,
                    AuthorId = comment.Author.Id,
                    AuthorFullName = comment.Author.FullName,
                    AuthorHeadline = comment.Author.Seeker?.Headline ?? "Thành viên",

                    // --- Gán dữ liệu mới ---
                    // 1. Gán dictionary đếm cảm xúc
                    ReactionCounts = commentReactionCounts,

                    // 2. Gán cảm xúc của tôi (nếu không có thì = null)
                    MyReaction = myReactions.ContainsKey(comment.Id) ? myReactions[comment.Id] : null
                });
            }

            return resultDtos;
        }

        // ... (Trong tệp Services/SocialPostService.cs)
        // ... (Giữ nguyên các hàm Comment)

        // --- THÊM HÀM MỚI VÀO CUỐI TỆP ---
        public async Task<bool> ReactToPostAsync(int postId, int userId, string reactionType)
        {
            // (PHẦN MỚI) 1. Lấy bài post để biết chủ nhân
            var post = await _context.SocialPosts.FindAsync(postId);
            if (post == null) return false; // Không tìm thấy post

            var postOwnerId = post.AuthorId;

            // (PHẦN CŨ) 2. Tìm reaction
            var existingReaction = await _context.SocialPostReactions
                .FirstOrDefaultAsync(r => r.PostId == postId && r.UserId == userId);

            bool sendNotification = false; // Cờ (flag) để quyết định

            if (existingReaction != null)
            {
                if (existingReaction.ReactionType == reactionType)
                {
                    // Bấm "Like" khi đang "Like" -> Gỡ Reaction (KHÔNG thông báo)
                    _context.SocialPostReactions.Remove(existingReaction);
                }
                else
                {
                    // Bấm "Love" khi đang "Like" -> Đổi Reaction (CÓ thông báo)
                    existingReaction.ReactionType = reactionType;
                    _context.SocialPostReactions.Update(existingReaction);
                    sendNotification = true;
                }
            }
            else
            {
                // --- CHƯA TỪNG REACTION ---
                // Tạo Reaction mới (CÓ thông báo)
                var newReaction = new SocialPostReaction
                {
                    PostId = postId,
                    UserId = userId,
                    ReactionType = reactionType
                };
                _context.SocialPostReactions.Add(newReaction);
                sendNotification = true;
            }

            await _context.SaveChangesAsync(); // <-- Đã lưu

            // --- (PHẦN NÂNG CẤP) TẠO THÔNG BÁO (NẾU LÀ BẠN BÈ) ---
            // (Chỉ chạy nếu sendNotification = true VÀ không phải tự "like" bài mình)
            if (sendNotification && postOwnerId != userId)
            {
                try
                {
                    // KIỂM TRA BẠN BÈ
                    bool areFriends = await _context.Friendships
                        .AnyAsync(f =>
                            (f.RequesterId == postOwnerId && f.ReceiverId == userId && f.Status == FriendshipStatus.Accepted) ||
                            (f.RequesterId == userId && f.ReceiverId == postOwnerId && f.Status == FriendshipStatus.Accepted)
                        );

                    if (areFriends)
                    {
                        var actor = await _context.Users.FindAsync(userId); // Lấy tên người "Like"
                        await _notificationService.CreateNotificationAsync(
                            recipientId: postOwnerId, // Gửi cho chủ post
                            actorId: userId,          // Người "Like"
                            message: $"đã thả cảm xúc ({reactionType}) cho bài viết của bạn.",
                            linkUrl: $"/posts/{post.Id}" // Link tới bài post
                        );
                    }
                }
                catch (System.Exception) { /* Lỗi gửi thông báo */ }
            }
            // --- (KẾT THÚC NÂNG CẤP) ---

            return true;
        }

        // ... (Trong tệp Services/SocialPostService.cs)
        // ... (Giữ nguyên các hàm Comment và ReactToPostAsync)

        // --- THÊM HÀM MỚI VÀO CUỐI TỆP ---
        public async Task<bool> ReactToCommentAsync(int commentId, int userId, string reactionType)
        {
            // 1. Kiểm tra comment có tồn tại không
            var commentExists = await _context.SocialPostComments.AnyAsync(c => c.Id == commentId);
            if (!commentExists)
            {
                return false; // Không tìm thấy comment
            }

            // 2. Tìm xem user đã reaction comment này chưa
            var existingReaction = await _context.SocialCommentReactions
                .FirstOrDefaultAsync(r => r.CommentId == commentId && r.UserId == userId);

            if (existingReaction != null)
            {
                // --- ĐÃ TỪNG REACTION ---
                if (existingReaction.ReactionType == reactionType)
                {
                    // Bấm "Like" khi đang "Like" -> Gỡ Reaction
                    _context.SocialCommentReactions.Remove(existingReaction);
                }
                else
                {
                    // Bấm "Love" khi đang "Like" -> Đổi Reaction
                    existingReaction.ReactionType = reactionType;
                    _context.SocialCommentReactions.Update(existingReaction);
                }
            }
            else
            {
                // --- CHƯA TỪNG REACTION ---
                var newReaction = new SocialCommentReaction
                {
                    CommentId = commentId,
                    UserId = userId,
                    ReactionType = reactionType
                };
                _context.SocialCommentReactions.Add(newReaction);
            }

            await _context.SaveChangesAsync();
            return true;
        }

    }
}