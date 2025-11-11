import React, { useState } from 'react';
import CreatePostWidget from './CreatePostWidget';
import PostCard from '../shared/PostCard';
import CreatePostModal from './CreatePostModal';

// Dữ liệu "giả" ban đầu
const initialMockPosts = [
  {
    id: 1,
    author: {
      name: 'Văn Đức Trung',
      avatar: 'https://ui-avatars.com/api/?name=Van+Duc+Trung&background=random',
      time: '2 giờ trước',
    },
    content: 'Mọi người cho mình hỏi kinh nghiệm phỏng vấn vị trí Fresher React với ạ, mình cảm ơn!',
    image: 'https://placehold.co/600x400/3498db/ffffff?text=React+JS',
    likes: 15,
    comments: 3,
  },
  {
    id: 2,
    author: {
      name: 'Đào Xuân Thông',
      avatar: 'https://ui-avatars.com/api/?name=Dao+Xuan+Thong&background=random',
      time: '5 giờ trước',
    },
    content: 'Chia sẻ template CV cho các bạn Back-end. Mọi người thấy cần thêm gì thì góp ý nhé!',
    image: null,
    likes: 42,
    comments: 11,
  },
];


const MainFeed = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState(initialMockPosts);

  // Sửa hàm này để nhận `file` (giả lập)
  const handleCreatePost = (newPostContent, file) => {
    if (!newPostContent.trim() && !file) return;

    const newPost = {
      id: posts.length + 1,
      author: {
        name: user.name,
        avatar: user.avatar,
        time: 'Vừa xong',
      },
      content: newPostContent,
      // Giả lập hiển thị ảnh nếu là file ảnh
      image: file?.type === 'Ảnh' ? `https://placehold.co/600x400/cccccc/ffffff?text=${file.name}` : null, 
      likes: 0,
      comments: 0,
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false); 
  };

  // Hàm mới để xóa bài viết
  const handleDeletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  return (
    <>
      <div className="space-y-6">
        <CreatePostWidget 
          user={user} 
          onClick={() => setIsModalOpen(true)}
        />
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUser={user}
            onDeletePost={handleDeletePost} // <-- Truyền hàm xóa xuống
          />
        ))}
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onCreatePost={handleCreatePost}
      />
    </>
  );
};

export default MainFeed;