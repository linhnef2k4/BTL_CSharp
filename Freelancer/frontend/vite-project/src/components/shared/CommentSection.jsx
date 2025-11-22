import React, { useState, useEffect } from 'react';
import { Send, MoreHorizontal, Trash2, ThumbsUp, MessageCircle } from 'lucide-react';
import socialService from '../../../services/socialService';
import { formatTimeAgo } from '../../utils/dateUtils';

// Helper lấy avatar
const getAvatarUrl = (fullName, avatarUrl) => {
  if (avatarUrl) return avatarUrl;
  const name = fullName ? fullName.replace(/\s/g, '+') : 'User';
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
};

// 1. Component hiển thị từng Comment (hỗ trợ đệ quy)
const CommentItem = ({ comment, postId, currentUser, onReplySuccess }) => {
  const [isLiked, setIsLiked] = useState(comment.myReaction === 'Like');
  const [likeCount, setLikeCount] = useState(comment.reactionCounts?.Like || 0);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Xử lý Like Comment
  const handleLike = async () => {
    if (!currentUser) return alert("Vui lòng đăng nhập!");
    const prevLiked = isLiked;
    setIsLiked(!isLiked);
    setLikeCount(prev => !prevLiked ? prev + 1 : prev - 1);

    try {
      await socialService.reactToComment(comment.id, "Like");
    } catch (error) {
      // Rollback
      setIsLiked(prevLiked);
      setLikeCount(prev => prevLiked ? prev + 1 : prev - 1);
    }
  };

  // Xử lý Gửi Reply
  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    setIsSendingReply(true);
    try {
      await socialService.postComment(postId, {
        content: replyContent,
        parentCommentId: comment.id
      });
      setReplyContent('');
      setIsReplying(false);
      onReplySuccess(); // Gọi callback để reload list
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="flex gap-3 mt-4 w-full">
      <img 
        src={getAvatarUrl(comment.authorFullName, comment.authorAvatarUrl)} 
        alt="avatar" 
        className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
      />
      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-block min-w-[200px]">
          <div className="font-bold text-sm text-gray-900">
            {comment.authorFullName}
          </div>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment.content}</p>
        </div>
        
        {/* Actions Line */}
        <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500 font-medium">
          <span>{formatTimeAgo(comment.createdDate)}</span>
          <button 
            onClick={handleLike}
            className={`hover:underline ${isLiked ? 'text-blue-600 font-bold' : ''}`}
          >
            Thích {likeCount > 0 && `(${likeCount})`}
          </button>
          <button onClick={() => setIsReplying(!isReplying)} className="hover:underline">
            Phản hồi
          </button>
        </div>

        {/* Input Reply */}
        {isReplying && (
          <div className="flex gap-2 mt-2 items-center">
             <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Trả lời ${comment.authorFullName}...`}
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 px-3 py-1.5 outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
            />
            <button onClick={handleSendReply} disabled={isSendingReply} className="text-blue-600 p-1">
              <Send size={16} />
            </button>
          </div>
        )}

        {/* Đệ quy: Render Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 pl-3 border-l-2 border-gray-200">
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                postId={postId} 
                currentUser={currentUser}
                onReplySuccess={onReplySuccess} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Component Chính
const CommentSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
        const res = await socialService.getComments(postId);
        setComments(res.data);
    } catch (err) {
        console.error("Lỗi tải comment:", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      // Comment gốc (parentCommentId = null)
      const res = await socialService.postComment(postId, {
        content: newComment,
        parentCommentId: null 
      });
      // Thêm vào đầu danh sách
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error("Lỗi post comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-4 border-t border-gray-100">
      {/* Input cho Comment Gốc */}
      {currentUser && (
        <div className="flex gap-3 mb-6">
          <img 
            src={getAvatarUrl(currentUser.fullName, currentUser.seeker?.avatarUrl)} 
            alt="my avatar" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
              placeholder="Viết bình luận..."
              className="w-full bg-gray-100 border-0 rounded-full px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
            />
            <button 
              onClick={handlePostComment}
              disabled={submitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 p-1 hover:bg-blue-50 rounded-full"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Danh sách Comments */}
      <div className="space-y-2">
        {loading ? (
             <p className="text-center text-gray-500 text-sm py-2">Đang tải bình luận...</p>
        ) : comments.length > 0 ? (
            comments.map(comment => (
                <CommentItem 
                    key={comment.id} 
                    comment={comment} 
                    postId={postId} 
                    currentUser={currentUser}
                    onReplySuccess={fetchComments} // Reload lại cây comment khi có reply mới
                />
            ))
        ) : (
            <p className="text-center text-gray-400 text-sm italic">Chưa có bình luận nào.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;