import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ThumbsUp, MessageSquare, Share2, Bookmark, MoreHorizontal, 
  EyeOff, Send, Loader2, ArrowLeft, X, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
// <<< 1. Đảm bảo đường dẫn này đúng
import { useAuth } from '../../context/AuthContext'; 

// --- HÀM HELPER ---

// Hàm tạo avatar (an toàn)
const getAvatarUrl = (user) => {
  // DTO (SocialPostDto/SocialCommentDto) có 'authorAvatarUrl'
  if (user?.authorAvatarUrl) { 
    return user.authorAvatarUrl;
  }
  // Fallback dùng tên
  const name = user?.authorFullName?.replace(/\s/g, '+') || '?';
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
}

// <<< 2. SỬA LỖI THỜI GIAN: Hàm tính toán thời gian
const formatTimeAgo = (dateString) => {
  if (!dateString) return '...'; 
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 0) return 'Vừa xong'; 
    if (seconds < 60) return 'Vừa xong';
    
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    
    const days = Math.round(hours / 24);
    return `${days} ngày trước`;
  } catch (e) {
    return '...'; 
  }
};

// ===========================================
// === 1. COMPONENT SHARE MODAL (Tích hợp API) ===
// (Giữ nguyên logic, không cần sửa)
// ===========================================
const ShareModal = ({ isOpen, onClose, postId }) => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      const fetchFriends = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsLoading(false);
          return;
        }
        try {
          const response = await axios.get('/api/friends', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFriends(response.data);
        } catch (error) {
          console.error("Lỗi khi tải danh sách bạn bè:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchFriends();
    } else {
      setSelectedUsers([]);
      setMessage("");
    }
  }, [isOpen]);

  const toggleUserSelection = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSendShare = async () => {
    setIsSending(true);
    console.log("Chia sẻ post", postId, "cho", selectedUsers, "với lời nhắn:", message);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);
    onClose();
  };

  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = { hidden: { opacity: 0, scale: 0.9, y: 40 }, visible: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 } };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
               <button onClick={onClose} className="rounded-full p-2 hover:bg-white/20 transition"><ArrowLeft size={20} /></button>
               <h3 className="text-lg font-semibold tracking-wide">Chia sẻ cho bạn bè</h3>
               <button onClick={onClose} className="rounded-full p-2 hover:bg-white/20 transition"><X size={20} /></button>
            </div>

            {/* DANH SÁCH BẠN BÈ THẬT */}
            <div className="flex space-x-4 overflow-x-auto px-4 py-5 scrollbar-thin">
              {isLoading ? (
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin mx-auto" />
              ) : friends.length === 0 ? (
                <span className="text-sm text-gray-500">Bạn chưa có bạn bè để chia sẻ.</span>
              ) : (
                friends.map((friend) => {
                  const isSelected = selectedUsers.includes(friend.friendId);
                  return (
                    <motion.button
                      key={friend.friendId}
                      onClick={() => toggleUserSelection(friend.friendId)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex flex-col items-center w-20 flex-shrink-0"
                    >
                      <div className="relative">
                        <img
                          src={getAvatarUrl({ authorFullName: friend.friendFullName })} // Dùng tên thật
                          alt={friend.friendFullName}
                          className={`h-14 w-14 rounded-full object-cover border-2 ${
                            isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
                          } transition-all duration-200`}
                        />
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -right-1 -bottom-1 rounded-full bg-white"
                          >
                            <CheckCircle size={20} className="text-blue-500 fill-current" />
                          </motion.div>
                        )}
                      </div>
                      <span className="mt-2 text-xs text-gray-700 text-center font-medium leading-tight">
                        {friend.friendFullName}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>
            {/* INPUT TIN NHẮN */}
            <div className="px-4 pb-3">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Thêm lời nhắn..." 
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>
            {/* NÚT GỬI */}
            <div className="px-4 pb-5">
              <motion.button
                onClick={handleSendShare}
                disabled={selectedUsers.length === 0 || isSending}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-white shadow-md transition-all duration-200 ${
                  selectedUsers.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                } disabled:opacity-70`}
              >
                {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {isSending ? 'Đang gửi...' : selectedUsers.length > 0 ? `Gửi (${selectedUsers.length})` : 'Chọn bạn để gửi'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// =============================================
// === 3. SỬA LỖI: COMPONENT COMMENT SECTION ===
// =============================================
const CommentSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const token = localStorage.getItem('authToken');

  // API 3: Lấy comment
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await axios.get(`/api/social-posts/${postId}/comments`, { headers });
        setComments(response.data);
      } catch (error) {
        console.error("Lỗi tải comment:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [postId, token]);

  // API 4: Đăng comment
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !token) return;

    setIsPosting(true);
    try {
      const payload = { content: newComment }; 
      const response = await axios.post(`/api/social-posts/${postId}/comments`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments([response.data, ...comments]);
      setNewComment(""); 
    } catch (error) {
      console.error("Lỗi đăng comment:", error);
    } finally {
      setIsPosting(false);
    }
  };

  // API 6: Thích comment
  const handleLikeComment = async (commentId) => {
    if (!token) {
      alert("Vui lòng đăng nhập để thích bình luận.");
      return;
    }
    
    // Cập nhật UI trước
    setComments(prevComments => 
      prevComments.map(c => 
        c.id === commentId 
          ? { ...c, isLikedByCurrentUser: !c.isLikedByCurrentUser } // (Giả định DTO comment cũng có 'isLikedByCurrentUser')
          : c
      )
    );

    try {
      const payload = { reactionType: "Like" }; 
      await axios.post(`/api/social-posts/comments/${commentId}/react`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Lỗi khi like comment:", error);
      // Rollback UI nếu lỗi
      setComments(prevComments => 
        prevComments.map(c => 
          c.id === commentId 
            ? { ...c, isLikedByCurrentUser: !c.isLikedByCurrentUser } 
            : c
        )
      );
    }
  };
  
  // (Hàm này tạm thời chưa làm gì cả vì chưa có API Reply)
  const handleReplyComment = (commentId) => {
    console.log("Trả lời comment", commentId);
  };


  return (
    <div className="pt-4 border-t border-gray-100">
      {/* Form đăng comment */}
      {currentUser && (
        <form onSubmit={handlePostComment} className="flex items-start gap-3 mb-4">
          <img 
            src={getAvatarUrl(currentUser.seeker)} 
            alt="My Avatar" 
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
              className="w-full rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <button 
              type="submit" 
              disabled={isPosting || !newComment.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-blue-600 hover:bg-blue-100 disabled:text-gray-400"
            >
              {isPosting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </form>
      )}

      {/* Danh sách comment */}
      <div className="space-y-3">
        {isLoading ? (
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin mx-auto" />
        ) : (
          comments.map(comment => {
            // <<< 4. SỬA LỖI CRASH (Giả định DTO Comment giống DTO Post)
            const displayAuthor = {
              id: comment.authorId,
              fullName: comment.authorFullName,
              avatarUrl: comment.authorAvatarUrl
            };
            
            return (
              <div key={comment.id} className="flex items-start gap-3">
                <img 
                  src={getAvatarUrl(displayAuthor)} // <<< Dùng displayAuthor
                  alt={displayAuthor.fullName}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-xl px-3 py-2">
                    <span className="font-semibold text-sm text-gray-800 hover:text-blue-500 cursor-pointer">
                      {displayAuthor.fullName} {/* <<< Dùng displayAuthor */}
                    </span>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                  {/* <<< 5. SỬA DESIGN (Thêm Like/Reply) */}
                  <div className="flex gap-2 px-2 mt-1">
                    <button 
                      onClick={() => handleLikeComment(comment.id)}
                      className={`text-xs font-medium ${comment.isLikedByCurrentUser ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
                    >
                      Thích
                    </button>
                    <span className="text-xs text-gray-400">·</span>
                    <button 
                      onClick={() => handleReplyComment(comment.id)}
                      className="text-xs font-medium text-gray-500 hover:text-blue-500"
                    >
                      Trả lời
                    </button>
                    <span className="text-xs text-gray-400">·</span>
                    {/* <<< 6. SỬA LỖI TIME (Giả định DTO Comment) */}
                    <span className="text-xs text-gray-400">{formatTimeAgo(comment.createdDate)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};


// ===================================
// === 7. COMPONENT ACTION BUTTON ===
// ===================================
const ActionButton = ({ icon, label, onClick, isActive = false, activeColor = '' }) => {
  const color = isActive ? activeColor : 'text-gray-600';
  const fill = isActive ? 'fill-current' : 'fill-none';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 transition-all duration-200 hover:bg-gray-50 ${color}`}
    >
      {React.cloneElement(icon, { className: `${fill} ${icon.props.className}` })}
      <span className={`text-sm font-medium ${isActive ? activeColor : 'text-gray-700'}`}>{label}</span>
    </motion.button>
  );
};


// ===================================
// === 8. COMPONENT POSTCARD (MAIN) ===
// ===================================
const PostCard = ({ post, currentUser }) => {
  
  // <<< 9. SỬA LỖI DTO (Đọc từ JSON bạn gửi)
  const { 
    id: postId, 
    authorId,
    authorFullName,
    authorHeadline,
    content, 
    imageUrl, 
    commentCount, 
    createdDate, // <<< Sửa từ createdAt
    reactionCounts, // <<< Sửa từ likeCount
    myReaction // <<< Sửa từ isLikedByCurrentUser
  } = post || {}; 

  if (!postId) {
    return null; // Không render gì nếu post lỗi
  }
  
  // <<< 10. SỬA LỖI DTO (State dựa trên DTO mới)
  const [likeCount, setLikeCount] = useState(reactionCounts?.Like || 0);
  const [isLiked, setIsLiked] = useState(!!myReaction); // (!!null = false, !!"Like" = true)

  const [isSaved, setIsSaved] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('authToken');

  // <<< 11. SỬA LỖI DTO (Kiểm tra an toàn)
  const isMyPost = currentUser && authorId && authorId === currentUser.id;

  // API 5: Thích bài viết (Giữ nguyên, đã đúng)
  const handleLike = async () => {
    if (!isAuthenticated || !token) {
      alert("Vui lòng đăng nhập để thích bài viết.");
      return;
    }
    
    const originalIsLiked = isLiked;
    const originalLikeCount = likeCount;
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    try {
      const payload = { reactionType: "Like" }; 
      await axios.post(`/api/social-posts/${postId}/react`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Lỗi khi like post:", error);
      setIsLiked(originalIsLiked);
      setLikeCount(originalLikeCount);
    }
  };

  const handleSave = () => setIsSaved((prev) => !prev);
  const toggleComments = () => setIsCommentsOpen((prev) => !prev);

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  // <<< 12. SỬA LỖI DTO (Tạo object author "giả" từ DTO phẳng)
  const displayAuthor = { 
    id: authorId, 
    fullName: authorFullName, 
    headline: authorHeadline 
  };
  const authorProfileUrl = authorId ? `/profile/${authorId}` : '#';

  return (
    <>
      <div className="rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to={authorProfileUrl}>
              <img
                src={getAvatarUrl(displayAuthor)} // <<< Dùng displayAuthor
                alt="Avatar"
                className="h-11 w-11 rounded-full border border-gray-200 object-cover cursor-pointer transition-transform hover:scale-105"
              />
            </Link>
            <div>
              <Link to={authorProfileUrl}>
                <h4 className="font-semibold text-gray-900 cursor-pointer hover:text-blue-500 transition-colors">
                  {displayAuthor.fullName} {/* <<< Dùng displayAuthor */}
                </h4>
              </Link>
              {/* <<< 13. SỬA LỖI TIME (Dùng createdDate) */}
              <p className="text-xs text-gray-500">{formatTimeAgo(createdDate)}</p>
            </div>
          </div>

          {/* 3 chấm (Xóa chức năng Delete vì chưa có API) */}
          <div className="relative">
            <button
              onClick={() => setIsOptionsOpen((prev) => !prev)}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition"
            >
              <MoreHorizontal size={20} />
            </button>
            <AnimatePresence>
              {isOptionsOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute right-0 z-10 mt-2 w-44 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden"
                  onMouseLeave={() => setIsOptionsOpen(false)}
                >
                  <button
                    onClick={() => setIsOptionsOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <EyeOff size={16} /> Ẩn bài viết
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-2">
          <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {/* Image (nếu có) */}
        {imageUrl && (
          <div className="max-h-[500px] overflow-hidden bg-gray-100">
            <img src={imageUrl} alt="Post content" className="w-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between px-4 py-2 text-sm text-gray-500 border-t border-gray-100">
          {/* <<< 14. SỬA LỖI COUNT (Dùng likeCount) */}
          <span>{likeCount} lượt thích</span>
          <span>{commentCount} bình luận</span>
        </div>

        {/* Action buttons */}
        <div className="flex px-2 pb-2 border-t border-gray-100">
          <ActionButton
            icon={<ThumbsUp size={20} />}
            label="Thích"
            onClick={handleLike}
            isActive={isLiked} // <<< 15. SỬA LỖI LIKE (Dùng isLiked)
            activeColor="text-blue-500"
          />
          <ActionButton
            icon={<MessageSquare size={20} />}
            label="Bình luận"
            onClick={toggleComments} // <<< SỬA LỖI: Nút này sẽ toggle
          />
          <ActionButton
            icon={<Share2 size={20} />}
            label="Chia sẻ"
            onClick={() => setIsShareOpen(true)}
          />
          <ActionButton
            icon={<Bookmark size={20} />}
            label="Lưu"
            onClick={handleSave}
            isActive={isSaved}
            activeColor="text-yellow-500"
          />
        </div>

        {/* <<< 16. SỬA LỖI COMMENT DROPDOWN */}
        <AnimatePresence>
          {isCommentsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 pb-4"
            >
              <CommentSection postId={postId} currentUser={currentUser} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        postId={postId} 
      />
    </>
  );
};

export default PostCard;