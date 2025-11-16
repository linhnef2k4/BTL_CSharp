import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, AlertTriangle } from 'lucide-react';
// <<< 1. Đảm bảo các đường dẫn import này là chính xác
import { useAuth } from '../../context/AuthContext.jsx'; 
import CreatePostWidget from './CreatePostWidget.jsx';
import PostCard from '../shared/PostCard.jsx';
import CreatePostModal from './CreatePostModal.jsx';

// --- Dữ liệu "giả" ĐÃ BỊ XÓA ---

const MainFeed = () => {
  // <<< 2. LẤY DATA TỪ CONTEXT
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]); // <<< 3. State thật
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // <<< 4. useEffect ĐỂ LẤY FEED (API 1: GET /api/social-posts/feed)
  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // API này (GetFeed) cho phép cả guest (AllowAnonymous)
        // Nhưng nếu ta đã login, ta nên gửi token
        const token = localStorage.getItem('authToken');
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get('/api/social-posts/feed', { headers });
        setPosts(response.data);
      } catch (err) {
        console.error("Lỗi khi tải feed:", err);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    // Chỉ fetch feed sau khi AuthContext đã check xong
    if (!isAuthLoading) {
      fetchFeed();
    }
  }, [isAuthLoading, isAuthenticated]); // Fetch lại khi đăng nhập/đăng xuất

  // <<< 5. HÀM TẠO BÀI POST MỚI (API 2: POST /api/social-posts)
  // Khớp với CreateSocialPostDto (content, imageUrl)
  // (Chúng ta sẽ giả định CreatePostModal xử lý việc upload và trả về imageUrl)
  const handleCreatePost = async (content, imageUrl) => {
    if (!content.trim()) return;

    const token = localStorage.getItem('authToken');
    if (!isAuthenticated || !token) {
      alert("Bạn cần đăng nhập để đăng bài.");
      return;
    }
    
    // Khớp với CreateSocialPostDto
    const payload = {
      content: content,
      imageUrl: imageUrl || null
    };

    try {
      // Gọi API 2 (POST /api/social-posts)
      const response = await axios.post('/api/social-posts', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // API trả về bài post vừa tạo
      const newPost = response.data;
      
      // Thêm bài post mới vào đầu danh sách
      setPosts([newPost, ...posts]);
      setIsModalOpen(false); 
    } catch (err) {
      console.error("Lỗi khi tạo bài post:", err);
      // (Bạn có thể hiển thị lỗi này trên Modal)
    }
  };

  // <<< 6. XỬ LÝ RENDER
  
  // Chờ AuthContext kiểm tra xong
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Chỉ hiển thị widget tạo post nếu ĐÃ ĐĂNG NHẬP */}
        {isAuthenticated && user && (
          <CreatePostWidget 
            user={user} // Pass user thật
            onClick={() => setIsModalOpen(true)}
          />
        )}

        {/* Xử lý loading/error của feed */}
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        )}

        {error && (
           <div className="flex flex-col items-center p-4 text-red-700 bg-red-100 rounded-lg" role="alert">
            <AlertTriangle className="h-6 w-6 mb-2" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Hiển thị danh sách bài post thật */}
        {!isLoading && !error && posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUser={user} // Pass user thật (có thể là null nếu là guest)
            // (onDeletePost sẽ được thêm sau khi có API)
          />
        ))}

        {!isLoading && !error && posts.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            Chưa có bài viết nào. Hãy là người đầu tiên!
          </div>
        )}
      </div>

      {/* Modal vẫn hoạt động, nhưng chỉ mở được nếu user đã login */}
      {user && (
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={user}
          onCreatePost={handleCreatePost} // <<< Truyền hàm API thật
        />
      )}
    </>
  );
};

export default MainFeed;