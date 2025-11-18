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
            // 1. Lấy các bài post
            var posts = await _context.SocialPosts
                // --- ĐÂY LÀ DÒNG BẠN VỪA THÊM ---
                .Where(p => p.IsDeleted == false) // Chỉ lấy bài chưa bị "xóa mềm"
                                                  // --- KẾT THÚC ---
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

                    // Gán dữ liệu mới
                    CommentCount = commentCounts.ContainsKey(post.Id) ? commentCounts[post.Id] : 0,
                    ReactionCounts = postReactionCounts,
                    MyReaction = myReactions.ContainsKey(post.Id) ? myReactions[post.Id] : null
                });
            }

            return resultDtos;
        }


        // --- THÊM 2 HÀM MỚI VÀO CUỐI TỆP ---

        public async Task<CommentDto> PostCommentAsync(int postId, int authorId, CreateCommentDto request)
        {
            var post = await _context.SocialPosts.FindAsync(postId);
            if (post == null)
            {
                return null; // Không tìm thấy bài post
            }

            // (Logic mới) Kiểm tra xem ParentCommentId (nếu có) có hợp lệ không
            if (request.ParentCommentId.HasValue)
            {
                var parentCommentExists = await _context.SocialPostComments
                    .AnyAsync(c => c.Id == request.ParentCommentId.Value && c.PostId == postId);
                if (!parentCommentExists)
                {
                    return null; // Lỗi: Trả lời một comment không tồn tại
                }
            }

            var newComment = new SocialPostComment
            {
                Content = request.Content,
                AuthorId = authorId,
                PostId = postId,
                ParentCommentId = request.ParentCommentId, // <-- Gán giá trị mới
                CreatedDate = DateTime.UtcNow
            };

            _context.SocialPostComments.Add(newComment);
            await _context.SaveChangesAsync();

            // (Phần thông báo "Bạn bè")
            try
            {
                if (post.AuthorId != authorId)
                {
                    bool areFriends = await _context.Friendships
                        .AnyAsync(f =>
                            (f.RequesterId == post.AuthorId && f.ReceiverId == authorId && f.Status == FriendshipStatus.Accepted) ||
                            (f.RequesterId == authorId && f.ReceiverId == post.AuthorId && f.Status == FriendshipStatus.Accepted)
                        );
                    if (areFriends)
                    {
                        var author = await _context.Users.FindAsync(authorId);
                        await _notificationService.CreateNotificationAsync(
                            recipientId: post.AuthorId,
                            actorId: authorId,
                            message: $"đã bình luận về bài viết của bạn.",
                            linkUrl: $"/posts/{post.Id}"
                        );
                    }
                }
            }
            catch (Exception) { /* Lỗi gửi thông báo */ }

            // Lấy thông tin tác giả để trả về DTO
            var commentAuthor = await _context.Users
                                .Include(u => u.Seeker)
                                .FirstOrDefaultAsync(u => u.Id == authorId);

            // Map sang DTO
            return new CommentDto
            {
                Id = newComment.Id,
                Content = newComment.Content,
                CreatedDate = newComment.CreatedDate,
                AuthorId = commentAuthor.Id,
                AuthorFullName = commentAuthor.FullName,
                AuthorHeadline = commentAuthor.Seeker?.Headline ?? "Thành viên",
                ReactionCounts = new Dictionary<string, int>(),
                MyReaction = null,
                Replies = new List<CommentDto>()
            };
        }

        // (Nhớ thêm using System.Linq; và System.Collections.Generic; nếu chưa có)

        public async Task<IEnumerable<CommentDto>> GetCommentsAsync(int postId, int? currentUserId)
        {
            // 1. Lấy TẤT CẢ comment của bài post (cả cha và con)
            var allComments = await _context.SocialPostComments
                .Where(c => c.PostId == postId)
                .Include(c => c.Author).ThenInclude(author => author.Seeker)
                .OrderBy(c => c.CreatedDate)
                .ToListAsync();

            if (!allComments.Any())
            {
                return new List<CommentDto>();
            }

            var commentIds = allComments.Select(c => c.Id).ToList();

            // 2. Lấy TẤT CẢ reaction cho TẤT CẢ comment (1 query)
            var reactionCountsList = await _context.SocialCommentReactions
                .Where(r => commentIds.Contains(r.CommentId))
                .GroupBy(r => new { r.CommentId, r.ReactionType })
                .Select(g => new { g.Key.CommentId, g.Key.ReactionType, Count = g.Count() })
                .ToListAsync();

            // 3. Lấy TẤT CẢ reaction CỦA TÔI (1 query)
            var myReactions = new Dictionary<int, string>();
            if (currentUserId.HasValue)
            {
                myReactions = await _context.SocialCommentReactions
                    .Where(r => commentIds.Contains(r.CommentId) && r.UserId == currentUserId.Value)
                    .ToDictionaryAsync(x => x.CommentId, x => x.ReactionType);
            }

            // 4. Xây dựng "cây" lồng nhau
            var commentDtoMap = new Dictionary<int, CommentDto>();
            var rootComments = new List<CommentDto>();

            // Hàm helper để map (ánh xạ)
            Func<SocialPostComment, CommentDto> MapToDto = (comment) =>
            {
                var reactionCounts = reactionCountsList
                    .Where(r => r.CommentId == comment.Id)
                    .ToDictionary(r => r.ReactionType, r => r.Count);

                return new CommentDto
                {
                    Id = comment.Id,
                    Content = comment.Content,
                    CreatedDate = comment.CreatedDate,
                    AuthorId = comment.Author.Id,
                    AuthorFullName = comment.Author.FullName,
                    AuthorHeadline = comment.Author.Seeker?.Headline ?? "Thành viên",
                    ReactionCounts = reactionCounts,
                    MyReaction = myReactions.GetValueOrDefault(comment.Id),
                    Replies = new List<CommentDto>() // <-- Khởi tạo rỗng
                };
            };

            // 5. Duyệt qua tất cả (Lần 1: Tạo map)
            foreach (var comment in allComments)
            {
                var dto = MapToDto(comment);
                commentDtoMap[comment.Id] = dto;
            }

            // 6. Duyệt (Lần 2: Gắn Con vào Cha)
            foreach (var comment in allComments)
            {
                var dto = commentDtoMap[comment.Id]; // Lấy DTO tương ứng
                if (comment.ParentCommentId == null)
                {
                    // Đây là comment gốc (Cha)
                    rootComments.Add(dto);
                }
                else
                {
                    // Đây là comment trả lời (Con)
                    if (commentDtoMap.TryGetValue(comment.ParentCommentId.Value, out var parentDto))
                    {
                        // Thêm "Con" vào danh sách "Replies" của "Cha"
                        parentDto.Replies.Add(dto);
                    }
                }
            }

            return rootComments;
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

        // (Hàm này dùng CreateSocialPostDto vì nó có Content và ImageUrl)
        public async Task<string?> UpdatePostAsync(int postId, int currentUserId, CreateSocialPostDto request)
        {
            // 1. Tìm bài post
            var post = await _context.SocialPosts.FindAsync(postId);

            if (post == null)
            {
                return "Không tìm thấy bài viết.";
            }

            // 2. Kiểm tra quyền sở hữu (Ownership)
            if (post.AuthorId != currentUserId)
            {
                return "Bạn không có quyền sửa bài viết này.";
            }

            // 3. Cập nhật
            post.Content = request.Content;
            post.ImageUrl = request.ImageUrl;

            await _context.SaveChangesAsync();
            return null; // Thành công
        }

        public async Task<string?> SoftDeletePostAsync(int postId, int currentUserId)
        {
            // 1. Tìm bài post
            var post = await _context.SocialPosts.FindAsync(postId);

            if (post == null)
            {
                return "Không tìm thấy bài viết.";
            }

            // 2. Kiểm tra quyền sở hữu
            if (post.AuthorId != currentUserId)
            {
                return "Bạn không có quyền xóa bài viết này.";
            }

            // 3. Thực hiện "Xóa mềm" (Soft Delete)
            post.IsDeleted = true;
            post.DeletedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return null; // Thành công
        }
        // --- THÊM 3 HÀM NÀY VÀO CUỐI TỆP "Services/SocialPostService.cs" ---

        // 1. LẤY BÀI VIẾT TRONG THÙNG RÁC
        public async Task<IEnumerable<SocialPostDto>> GetMyTrashAsync(int currentUserId)
        {
            // Chỉ lấy bài viết CỦA TÔI và ĐÃ BỊ XÓA MỀM
            var posts = await _context.SocialPosts
                .Where(p => p.AuthorId == currentUserId && p.IsDeleted == true)
                .Include(p => p.Author) // Lấy thông tin tác giả
                    .ThenInclude(author => author.Seeker)
                .OrderByDescending(p => p.DeletedDate) // Sắp xếp theo ngày xóa
                .ToListAsync();

            // Chúng ta có thể dùng lại SocialPostDto (DTO của Feed)
            return posts.Select(post => new SocialPostDto
            {
                Id = post.Id,
                Content = post.Content,
                ImageUrl = post.ImageUrl,
                CreatedDate = post.CreatedDate,
                AuthorId = post.Author.Id,
                AuthorFullName = post.Author.FullName,
                AuthorHeadline = post.Author.Seeker?.Headline ?? "Thành viên",
                // (Lưu ý: DTO này không có DeletedDate, bạn có thể thêm nếu muốn)
            });
        }

        // 2. KHÔI PHỤC BÀI VIẾT
        public async Task<string?> RestorePostAsync(int postId, int currentUserId)
        {
            var post = await _context.SocialPosts.FindAsync(postId);

            if (post == null)
            {
                return "Không tìm thấy bài viết.";
            }

            // Kiểm tra quyền sở hữu
            if (post.AuthorId != currentUserId)
            {
                return "Bạn không có quyền khôi phục bài viết này.";
            }

            // Kiểm tra xem nó có trong thùng rác không
            if (post.IsDeleted == false)
            {
                return "Bài viết này không ở trong thùng rác.";
            }

            // Khôi phục
            post.IsDeleted = false;
            post.DeletedDate = null; // Xóa ngày xóa

            await _context.SaveChangesAsync();
            return null; // Thành công
        }

        // 3. XÓA VĨNH VIỄN
        public async Task<string?> DeletePostPermanentAsync(int postId, int currentUserId)
        {
            var post = await _context.SocialPosts.FindAsync(postId);

            if (post == null)
            {
                return "Không tìm thấy bài viết.";
            }

            // Kiểm tra quyền sở hữu
            if (post.AuthorId != currentUserId)
            {
                return "Bạn không có quyền xóa bài viết này.";
            }

            // Thực hiện "Xóa cứng" (Hard Delete)
            // (EF Core sẽ tự động xóa các Comment/Reaction liên quan
            // vì chúng ta đã cài "OnDelete(DeleteBehavior.Cascade)" trong DbContext)
            _context.SocialPosts.Remove(post);

            await _context.SaveChangesAsync();
            return null; // Thành công
        }

        // --- THÊM HÀM NÀY VÀO CUỐI TỆP "Services/SocialPostService.cs" ---

        public async Task<IEnumerable<SocialPostDto>> GetMyPostsAsync(int currentUserId)
        {
            // 1. Lấy các bài post CỦA TÔI (và chưa bị xóa)
            var posts = await _context.SocialPosts
                .Where(p => p.AuthorId == currentUserId && p.IsDeleted == false) // <-- Lọc CỦA TÔI
                .Include(post => post.Author)
                    .ThenInclude(author => author.Seeker)
                .OrderByDescending(post => post.CreatedDate)
                .Take(50) // Lấy 50 bài mới nhất
                .ToListAsync();

            if (!posts.Any())
            {
                return new List<SocialPostDto>(); // Trả về list rỗng
            }

            // (Code dưới đây giống hệt GetFeedAsync, để lấy Reaction/Comment Count)

            var postIds = posts.Select(p => p.Id).ToList();

            // 2. Lấy TỔNG SỐ COMMENT
            var commentCounts = await _context.SocialPostComments
                .Where(c => postIds.Contains(c.PostId))
                .GroupBy(c => c.PostId)
                .Select(g => new { PostId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.PostId, x => x.Count);

            // 3. Lấy SỐ LƯỢNG CẢM XÚC (Like, Love...)
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

            // 4. Lấy CẢM XÚC CỦA TÔI (MyReaction)
            // (Vì đây là "MyPosts", currentUserId luôn tồn tại)
            var myReactions = await _context.SocialPostReactions
                .Where(r => postIds.Contains(r.PostId) && r.UserId == currentUserId)
                .ToDictionaryAsync(x => x.PostId, x => x.ReactionType);

            // 5. "Ghép" tất cả dữ liệu lại
            var resultDtos = new List<SocialPostDto>();
            foreach (var post in posts)
            {
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

                    CommentCount = commentCounts.ContainsKey(post.Id) ? commentCounts[post.Id] : 0,
                    ReactionCounts = postReactionCounts,
                    MyReaction = myReactions.ContainsKey(post.Id) ? myReactions[post.Id] : null
                });
            }

            return resultDtos;
        }
    }
}