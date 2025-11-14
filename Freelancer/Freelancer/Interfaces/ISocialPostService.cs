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
    }
}