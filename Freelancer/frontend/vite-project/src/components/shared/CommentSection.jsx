import React, { useState } from 'react';
import { Send, MoreHorizontal, Trash2, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Component con cho 1 bình luận (ĐÃ NÂNG CẤP SIÊU XỊN)
const Comment = ({ comment, currentUser, postAuthor }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isReplying, setIsReplying] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  // Thêm state cho replies
  const [replies, setReplies] = useState([]); 

  const handleLike = () => {
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(prev => !prev);
  };
  
  const handleReplySubmit = (replyText) => {
    const newReply = {
      id: replies.length + 1,
      author: currentUser,
      text: replyText,
    };
    setReplies([...replies, newReply]);
    setIsReplying(false); // Đóng input sau khi trả lời
  };

  const isMyComment = comment.author.name === currentUser.name;
  const isPostAuthor = comment.author.name === postAuthor.name;

  return (
    <div className="flex items-start space-x-2">
      <img src={comment.author.avatar} alt="Avatar" className="mt-1 h-8 w-8 rounded-full" />
      <div className="flex-1">
        <div className="group relative">
          <div className="inline-block rounded-lg bg-gray-100 px-3 py-2">
            <span className="font-semibold text-sm">{comment.author.name}</span>
            {/* Tag "Tác giả" (như ảnh) */}
            {isPostAuthor && (
              <span className="ml-2 text-xs font-medium text-gray-500">· Tác giả</span>
            )}
            <p className="text-sm">{comment.text}</p>
            {/* Hiển thị số Like (nếu có) */}
            {likeCount > 0 && (
              <span className="absolute -bottom-3 -right-3 rounded-full bg-white px-1 py-0.5 text-xs shadow">
                👍 {likeCount}
              </span>
            )}
          </div>
          
          {/* Nút 3 chấm (MỚI) */}
          <button 
            onClick={() => setIsOptionsOpen(prev => !prev)}
            className="absolute right-0 top-0 hidden rounded-full p-1 text-gray-500 opacity-0 group-hover:opacity-100 md:inline-block"
          >
            <MoreHorizontal size={16} />
          </button>
          
          {/* Dropdown cho comment */}
          <AnimatePresence>
            {isOptionsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 top-8 z-10 w-32 rounded-md bg-white py-1 shadow-lg"
                onMouseLeave={() => setIsOptionsOpen(false)} // Tự đóng
              >
                {isMyComment ? (
                  <button className="flex w-full items-center gap-2 px-3 py-1 text-sm text-red-600 hover:bg-gray-100">
                    <Trash2 size={14} /> Xóa
                  </button>
                ) : (
                  <button className="flex w-full items-center gap-2 px-3 py-1 text-sm hover:bg-gray-100">
                    <EyeOff size={14} /> Ẩn
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Nút Like, Trả lời (ĐÃ NÂNG CẤP) */}
        <div className="pl-2 mt-1 flex space-x-3 text-xs text-gray-500">
          <button 
            onClick={handleLike}
            className={`font-semibold hover:underline ${isLiked ? 'text-blue-600' : ''}`}
          >
            Thích
          </button>
          <button 
            onClick={() => setIsReplying(prev => !prev)}
            className="font-semibold hover:underline"
          >
            Trả lời
          </button>
          <span>· 5 phút</span>
        </div>
        
        {/* Hiển thị các trả lời */}
        <div className="mt-2 space-y-2 pl-4">
          {replies.map(reply => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              currentUser={currentUser} 
              postAuthor={postAuthor} 
            />
          ))}
        </div>

        {/* Input Trả lời (MỚI) */}
        {isReplying && (
          <div className="mt-2">
            <CommentInput currentUser={currentUser} onSubmit={handleReplySubmit} isReply={true} />
          </div>
        )}
      </div>
    </div>
  );
};

// Tách Input ra làm component con cho "sạch"
const CommentInput = ({ currentUser, onSubmit, isReply = false }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <div className={`flex items-center space-x-2 ${isReply ? '' : 'mb-4'}`}>
      <img src={currentUser.avatar} alt="Avatar" className="h-8 w-8 rounded-full" />
      <div className="flex-1 relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Viết bình luận..."
          className="w-full rounded-full bg-gray-100 px-4 py-2 text-sm focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button 
          onClick={handleSubmit}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-blue-600 hover:bg-gray-200"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

// Dữ liệu "giả"
const mockComments = [
  {
    id: 1,
    author: { name: 'Đào Xuân Thông', avatar: 'https://ui-avatars.com/api/?name=DT&background=random' },
    text: 'Bài viết hay quá!',
  },
  {
    id: 2,
    author: { name: 'Văn Đức Trung', avatar: 'https://ui-avatars.com/api/?name=VT&background=random' },
    text: 'Cảm ơn chia sẻ của bạn.',
  },
];

const CommentSection = ({ currentUser, postAuthor }) => {
  const [comments, setComments] = useState(mockComments);

  const handlePostComment = (commentText) => {
    const comment = {
      id: comments.length + 1,
      author: { name: currentUser.name, avatar: currentUser.avatar },
      text: commentText,
    };
    setComments([...comments, comment]);
  };

  return (
    <div className="border-t p-4">
      {/* Input để viết comment mới */}
      <CommentInput currentUser={currentUser} onSubmit={handlePostComment} />

      {/* Danh sách các comment đã có */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment 
            key={comment.id} 
            comment={comment} 
            currentUser={currentUser} 
            postAuthor={postAuthor} 
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;