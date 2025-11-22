import React, { useState } from 'react';
import { 
  ThumbsUp, MessageSquare, Share2, Bookmark, MoreHorizontal, 
  Trash2, Edit, Globe
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import CommentSection from './CommentSection';
import { formatTimeAgo } from '../../utils/dateUtils';
import socialService from '../../../services/socialService';

const getAvatarUrl = (fullName, avatarUrl) => {
  if (avatarUrl) return avatarUrl;
  const name = fullName ? fullName.replace(/\s/g, '+') : 'User';
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
};

const PostCard = ({ post, currentUser, onDeleteSuccess }) => {
  const navigate = useNavigate(); // Hook để chuyển trang

  const { 
    id, authorId, authorFullName, authorHeadline, authorAvatarUrl,
    content, imageUrl, commentCount, createdDate, 
    reactionCounts, myReaction, isSaved: initialSavedState 
  } = post;

  const [likeCount, setLikeCount] = useState(reactionCounts?.Like || 0);
  const [isLiked, setIsLiked] = useState(myReaction === 'Like');
  const [isSaved, setIsSaved] = useState(initialSavedState);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isMyPost = currentUser && currentUser.id === authorId;

  // --- HANDLERS ---
  const handleLike = async () => {
    if (!currentUser) return alert("Vui lòng đăng nhập!");
    const prevLiked = isLiked;
    setIsLiked(!isLiked);
    setLikeCount(prev => !prevLiked ? prev + 1 : prev - 1);
    try {
      await socialService.reactToPost(id, "Like");
    } catch (error) {
      setIsLiked(prevLiked);
      setLikeCount(prev => prevLiked ? prev + 1 : prev - 1);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return alert("Vui lòng đăng nhập!");
    const prevSaved = isSaved;
    setIsSaved(!isSaved);
    setShowMenu(false);
    try {
        if (prevSaved) await socialService.unsavePost(id);
        else await socialService.savePost(id);
    } catch (error) {
        setIsSaved(prevSaved);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn chắc chắn muốn chuyển bài viết này vào thùng rác?")) return;
    try {
        await socialService.deletePost(id);
        if (onDeleteSuccess) onDeleteSuccess(id);
    } catch (error) {
        alert("Có lỗi xảy ra khi xóa bài viết.");
    }
  };

  // Hàm chuyển hướng đến Profile
  const handleGoToProfile = (e) => {
    e.stopPropagation();
    navigate(`/user/${authorId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5 transition-all hover:shadow-md">
      {/* Header */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          {/* Click Avatar -> Profile */}
          <div onClick={handleGoToProfile} className="cursor-pointer">
            <img 
              src={getAvatarUrl(authorFullName, authorAvatarUrl)} 
              alt={authorFullName} 
              className="w-11 h-11 rounded-full object-cover border border-gray-100 hover:opacity-90 transition"
            />
          </div>
          <div>
            {/* Click Tên -> Profile */}
            <div onClick={handleGoToProfile} className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer leading-tight text-[15px]">
              {authorFullName}
            </div>
            <span className="text-xs text-gray-500 line-clamp-1">{authorHeadline || "Thành viên"}</span>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <span>{formatTimeAgo(createdDate)}</span>
              <span>•</span>
              <Globe size={12} />
            </div>
          </div>
        </div>

        {/* Menu Dropdown */}
        <div className="relative">
            <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"
            >
                <MoreHorizontal size={20} />
            </button>
            {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 overflow-hidden">
                    <button 
                        onClick={handleSave}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Bookmark size={16} className={isSaved ? "fill-yellow-500 text-yellow-500" : ""} />
                        {isSaved ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
                    </button>
                    {isMyPost && (
                        <>
                            <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Edit size={16} /> Chỉnh sửa
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Xóa bài viết
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-wrap text-[15px] leading-relaxed">{content}</p>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="w-full bg-gray-50 border-t border-b border-gray-100">
            <img src={imageUrl} alt="Post content" className="w-full h-auto max-h-[600px] object-contain" />
        </div>
      )}

      {/* Stats & Actions (Giữ nguyên như cũ) */}
      <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
         <div className="flex items-center gap-1.5">
            {likeCount > 0 && (
                <>
                    <div className="bg-blue-500 rounded-full p-1">
                        <ThumbsUp size={10} className="text-white fill-white" />
                    </div>
                    <span className="text-sm text-gray-500 hover:underline cursor-pointer">{likeCount}</span>
                </>
            )}
         </div>
         <button 
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="text-sm text-gray-500 hover:underline"
         >
            {commentCount} bình luận
         </button>
      </div>

      <div className="flex px-2 py-1">
        <button 
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition ${isLiked ? 'text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
        >
            <ThumbsUp size={18} className={isLiked ? "fill-blue-600" : ""} />
            Thích
        </button>
        <button 
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-100 transition"
        >
            <MessageSquare size={18} />
            Bình luận
        </button>
        <button 
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-100 transition"
        >
            <Share2 size={18} />
            Chia sẻ
        </button>
      </div>

      <AnimatePresence>
        {isCommentsOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 overflow-hidden"
            >
                <CommentSection postId={id} currentUser={currentUser} />
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostCard;