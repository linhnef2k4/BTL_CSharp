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

        public SocialPostService(ApplicationDbContext context)
        {
            _context = context;
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
            // 1. Kiểm tra xem bài post có tồn tại không
            var postExists = await _context.SocialPosts.AnyAsync(p => p.Id == postId);
            if (!postExists)
            {
                return null; // Hoặc ném ra lỗi "Không tìm thấy bài post"
            }

            // 2. Tạo model Comment
            var newComment = new SocialPostComment
            {
                Content = request.Content,
                AuthorId = authorId,
                PostId = postId,
                CreatedDate = DateTime.UtcNow
            };

            // 3. Lưu vào DB
            _context.SocialPostComments.Add(newComment);
            await _context.SaveChangesAsync();

            // 4. Lấy thông tin tác giả để trả về DTO
            var author = await _context.Users
                                .Include(u => u.Seeker)
                                .FirstOrDefaultAsync(u => u.Id == authorId);

            // 5. Map sang DTO
            return new CommentDto
            {
                Id = newComment.Id,
                Content = newComment.Content,
                CreatedDate = newComment.CreatedDate,
                AuthorId = author.Id,
                AuthorFullName = author.FullName,
                AuthorHeadline = author.Seeker?.Headline ?? "Thành viên"
            };
        }

        public async Task<IEnumerable<CommentDto>> GetCommentsAsync(int postId)
        {
            var comments = await _context.SocialPostComments
                .Where(c => c.PostId == postId) // Lấy comment của bài post
                .Include(c => c.Author)         // Lấy thông tin người viết
                    .ThenInclude(author => author.Seeker) // Lấy luôn Seeker (để lấy Headline)
                .OrderBy(c => c.CreatedDate) // Sắp xếp cũ -> mới
                .ToListAsync();

            // Map danh sách
            return comments.Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                CreatedDate = c.CreatedDate,
                AuthorId = c.Author.Id,
                AuthorFullName = c.Author.FullName,
                AuthorHeadline = c.Author.Seeker?.Headline ?? "Thành viên"
            });
        }

        // ... (Trong tệp Services/SocialPostService.cs)
        // ... (Giữ nguyên các hàm Comment)

        // --- THÊM HÀM MỚI VÀO CUỐI TỆP ---
        public async Task<bool> ReactToPostAsync(int postId, int userId, string reactionType)
        {
            // 1. Tìm xem user đã reaction bài này chưa
            var existingReaction = await _context.SocialPostReactions
                .FirstOrDefaultAsync(r => r.PostId == postId && r.UserId == userId);

            if (existingReaction != null)
            {
                // --- ĐÃ TỪNG REACTION ---
                if (existingReaction.ReactionType == reactionType)
                {
                    // Bấm "Like" khi đang "Like" -> Gỡ Reaction (Un-react)
                    _context.SocialPostReactions.Remove(existingReaction);
                }
                else
                {
                    // Bấm "Love" khi đang "Like" -> Đổi Reaction
                    existingReaction.ReactionType = reactionType;
                    _context.SocialPostReactions.Update(existingReaction);
                }
            }
            else
            {
                // --- CHƯA TỪNG REACTION ---
                // Tạo Reaction mới
                var newReaction = new SocialPostReaction
                {
                    PostId = postId,
                    UserId = userId,
                    ReactionType = reactionType
                };
                _context.SocialPostReactions.Add(newReaction);
            }

            // Lưu tất cả thay đổi vào DB
            await _context.SaveChangesAsync();
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