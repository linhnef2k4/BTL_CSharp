import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Share2, Bookmark, MoreHorizontal, Trash2, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import CommentSection from './CommentSection';
import ShareModal from './ShareModal';

// Nút bấm có animation
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

const PostCard = ({ post, currentUser, onDeletePost }) => {
  const { author, content, image, comments } = post;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ặ|ẵ|â|ấ|ầ|ẩ|ậ|ẫ/g, 'a')
      .replace(/é|è|ẻ|ẹ|ẽ|ê|ế|ề|ể|ệ|ễ/g, 'e')
      .replace(/í|ì|ỉ|ị|ĩ/g, 'i')
      .replace(/ó|ò|ỏ|ọ|õ|ô|ố|ồ|ổ|ộ|ỗ|ơ|ớ|ờ|ở|ợ|ỡ/g, 'o')
      .replace(/ú|ù|ủ|ụ|ũ|ư|ứ|ừ|ử|ự|ữ/g, 'u')
      .replace(/ý|ỳ|ỷ|ỵ|ỹ/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');

  const profileUrl = `/profile/${slugify(author.name)}`;

  const handleLike = () => {
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((prev) => !prev);
  };

  const handleSave = () => setIsSaved((prev) => !prev);
  const toggleComments = () => setIsCommentsOpen((prev) => !prev);
  const isMyPost = post.author.name === currentUser.name;

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <div className="rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to={profileUrl}>
              <img
                src={author.avatar}
                alt="Avatar"
                className="h-11 w-11 rounded-full border border-gray-200 object-cover cursor-pointer transition-transform hover:scale-105"
              />
            </Link>
            <div>
              <Link to={profileUrl}>
                <h4 className="font-semibold text-gray-900 cursor-pointer hover:text-blue-500 transition-colors">
  {author.name}
</h4>

              </Link>
              <p className="text-xs text-gray-500">{author.time}</p>
            </div>
          </div>

          {/* 3 chấm */}
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
                  {isMyPost ? (
                    <button
                      onClick={() => {
                        onDeletePost(post.id);
                        setIsOptionsOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      <Trash2 size={16} /> Xóa bài viết
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsOptionsOpen(false)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <EyeOff size={16} /> Ẩn bài viết
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-2">
          <p className="text-gray-800 text-[15px] leading-relaxed">{content}</p>
        </div>

        {image && (
          <div className="max-h-[500px] overflow-hidden bg-gray-100">
            <img src={image} alt="Post content" className="w-full object-cover transition-transform duration-300 hover:scale-[1.02]" />
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between px-4 py-2 text-sm text-gray-500 border-t border-gray-100">
          <span>{likeCount} lượt thích</span>
          <span>{comments} bình luận</span>
        </div>

        {/* Action buttons */}
        <div className="flex px-2 pb-2 border-t border-gray-100">
          <ActionButton
            icon={<ThumbsUp size={20} />}
            label="Thích"
            onClick={handleLike}
            isActive={isLiked}
            activeColor="text-blue-500"
          />
          <ActionButton
            icon={<MessageSquare size={20} />}
            label="Bình luận"
            onClick={toggleComments}
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

        {/* Comment Section */}
        <AnimatePresence>
          {isCommentsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 pb-4"
            >
              <CommentSection currentUser={currentUser} postAuthor={author} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </>
  );
};

export default PostCard;
