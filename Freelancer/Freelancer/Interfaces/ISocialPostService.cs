using Freelancer.DTOs;

namespace Freelancer.Interfaces
{
    public interface ISocialPostService
    {
        // Lấy feed (trang chủ)
        Task<IEnumerable<SocialPostDto>> GetFeedAsync(int? currentUserId);

        // Tạo bài đăng
        Task<SocialPostDto> CreatePostAsync(int authorId, CreateSocialPostDto request);
        Task<CommentDto> PostCommentAsync(int postId, int authorId, CreateCommentDto request);
        Task<IEnumerable<CommentDto>> GetCommentsAsync(int postId, int? currentUserId);
        Task<bool> ReactToPostAsync(int postId, int userId, string reactionType);

        Task<bool> ReactToCommentAsync(int commentId, int userId, string reactionType);
        Task<string?> UpdatePostAsync(int postId, int currentUserId, CreateSocialPostDto request);
        Task<string?> SoftDeletePostAsync(int postId, int currentUserId);


        // 1. Lấy danh sách bài trong thùng rác
        Task<IEnumerable<SocialPostDto>> GetMyTrashAsync(int currentUserId);

        // 2. Khôi phục bài viết
        Task<string?> RestorePostAsync(int postId, int currentUserId);

        // 3. Xóa vĩnh viễn
        Task<string?> DeletePostPermanentAsync(int postId, int currentUserId);
        Task<IEnumerable<SocialPostDto>> GetMyPostsAsync(int currentUserId);
    }
}