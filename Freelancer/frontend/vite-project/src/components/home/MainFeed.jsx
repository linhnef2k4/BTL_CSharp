import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CreatePostWidget from './CreatePostWidget';
import PostCard from '../shared/PostCard';
import CreatePostModal from './CreatePostModal';
import socialService from '../../../services/socialService';

const MainFeed = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Feed
  const fetchFeed = async () => {
    setIsLoadingFeed(true);
    try {
      const response = await socialService.getFeed();
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error("Lỗi tải feed:", err);
      setError("Không thể tải bài viết. Vui lòng kiểm tra kết nối mạng.");
    } finally {
      setIsLoadingFeed(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      fetchFeed();
    }
  }, [isAuthLoading, isAuthenticated]);

  // Handler: Tạo bài viết mới
  const handleCreatePost = async (content, imageUrl) => {
    try {
      const response = await socialService.createPost({
        content: content,
        imageUrl: imageUrl || null
      });
      // Thêm bài mới lên đầu danh sách
      setPosts([response.data, ...posts]);
    } catch (err) {
      console.error("Lỗi tạo bài viết:", err);
      alert("Đăng bài thất bại!");
    }
  };

  // Handler: Xóa bài viết (cập nhật state)
  const handlePostDelete = (deletedId) => {
      setPosts(posts.filter(p => p.id !== deletedId));
  };

  // --- RENDER ---
  if (isAuthLoading) {
    return (
       <div className="flex justify-center pt-10">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
       </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto pb-20">
        {/* Widget tạo bài (chỉ hiện khi login) */}
        {isAuthenticated && user && (
            <CreatePostWidget 
                user={user} 
                onClick={() => setIsModalOpen(true)} 
            />
        )}

        {/* Loading State */}
        {isLoadingFeed && (
            <div className="space-y-4">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white h-48 rounded-2xl shadow-sm animate-pulse"></div>
                ))}
            </div>
        )}

        {/* Error State */}
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
                <AlertTriangle size={20} />
                <span>{error}</span>
                <button onClick={fetchFeed} className="underline font-medium ml-auto">Thử lại</button>
            </div>
        )}

        {/* Empty State */}
        {!isLoadingFeed && !error && posts.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
                <img src="https://illustrations.popsy.co/gray/surr-waiting.svg" className="h-40 mx-auto mb-4 opacity-80" alt="Empty" />
                <p className="text-gray-500">Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!</p>
            </div>
        )}

        {/* List Posts */}
        <div className="space-y-5">
            {posts.map(post => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUser={user} 
                    onDeleteSuccess={handlePostDelete}
                />
            ))}
        </div>
      </div>

      {/* Modal */}
      {user && (
        <CreatePostModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={user}
            onCreatePost={handleCreatePost}
        />
      )}
    </>
  );
};

export default MainFeed;