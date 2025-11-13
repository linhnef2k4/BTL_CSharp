using Freelancer.DTOs;
using Freelancer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Freelancer.Controllers
{
    [ApiController]
    [Route("api/social-posts")]
    public class SocialPostController : ControllerBase
    {
        private readonly ISocialPostService _socialPostService;

        public SocialPostController(ISocialPostService socialPostService)
        {
            _socialPostService = socialPostService;
        }

        // Hàm helper để lấy UserId từ Token (copy từ ProfileController)
        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return int.Parse(userIdClaim.Value);
        }
        // --- THÊM HÀM HELPER MỚI NÀY ---
        // Hàm này sẽ trả về ID nếu đăng nhập, trả về null nếu là khách
        private int? GetUserIdFromToken_Optional()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return null;
            }
            return int.Parse(userIdClaim.Value);
        }
        // --- API 1: Lấy Feed (Mọi người đều xem được) ---
        [HttpGet("feed")]
        [AllowAnonymous] // Không cần đăng nhập
        
        public async Task<IActionResult> GetFeed()
        {
            // Lấy ID (nếu có)
            var currentUserId = GetUserIdFromToken_Optional();

            // Truyền ID vào Service
            var feed = await _socialPostService.GetFeedAsync(currentUserId);
            return Ok(feed);
        }

        // --- API 2: Đăng bài (Phải đăng nhập) ---
        [HttpPost]
        [Authorize] // <-- QUAN TRỌNG: Chỉ cần đăng nhập
        public async Task<IActionResult> CreatePost(CreateSocialPostDto request)
        {
            var authorId = GetUserIdFromToken();
            var newPost = await _socialPostService.CreatePostAsync(authorId, request);

            // Trả về bài post vừa tạo
            return CreatedAtAction(nameof(GetFeed), new { id = newPost.Id }, newPost);
        }



        // ... (Trong tệp Controllers/SocialPostController.cs)
        // ... (Giữ nguyên hàm GetUserIdFromToken, GetFeed, CreatePost)

        // --- API 3: LẤY TẤT CẢ COMMENT CỦA 1 BÀI POST ---
        // (Ai cũng xem được)
        [HttpGet("{postId}/comments")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCommentsForPost(int postId)
        {
            var comments = await _socialPostService.GetCommentsAsync(postId);
            return Ok(comments);
        }

        // --- API 4: VIẾT COMMENT MỚI ---
        // (Phải đăng nhập)
        [HttpPost("{postId}/comments")]
        [Authorize]
        public async Task<IActionResult> PostComment(int postId, CreateCommentDto request)
        {
            var authorId = GetUserIdFromToken();
            var newComment = await _socialPostService.PostCommentAsync(postId, authorId, request);

            if (newComment == null)
                {
                return NotFound("Không tìm thấy bài post.");
            }

            return CreatedAtAction(nameof(GetCommentsForPost), new { postId = postId, id = newComment.Id }, newComment);
        }

        // ... (Trong tệp Controllers/SocialPostController.cs)
        // ... (Giữ nguyên các API Comment)

        // --- API 5: THẢ CẢM XÚC (LIKE/LOVE/HAHA) ---
        // (Phải đăng nhập)
        [HttpPost("{postId}/react")]
        [Authorize]
        public async Task<IActionResult> ReactToPost(int postId, CreateReactionDto request)
        {
            var userId = GetUserIdFromToken();
            var result = await _socialPostService.ReactToPostAsync(postId, userId, request.ReactionType);

            if (!result)
            {
                // Trường hợp này gần như không xảy ra
                return BadRequest("Có lỗi xảy ra.");
            }

            return Ok("Thả cảm xúc thành công.");
        }

        // ... (Trong tệp Controllers/SocialPostController.cs)
        // ... (Giữ nguyên các API Comment và React (Post))

        // --- API 6: THẢ CẢM XÚC CHO COMMENT ---
        // (Phải đăng nhập)
        // (API này không cần postId, vì commentId đã là duy nhất)
        [HttpPost("comments/{commentId}/react")]
        [Authorize]
        public async Task<IActionResult> ReactToComment(int commentId, CreateReactionDto request)
        {
            var userId = GetUserIdFromToken();
            // (Chúng ta có thể tái sử dụng CreateReactionDto)
            var result = await _socialPostService.ReactToCommentAsync(commentId, userId, request.ReactionType);

            if (!result)
            {
                return NotFound("Không tìm thấy bình luận.");
            }

            return Ok("Thả cảm xúc (comment) thành công.");
        }
    }
}