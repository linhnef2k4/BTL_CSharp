import React, { useState, useEffect } from 'react';
import { Bookmark, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PostCard from '../../components/shared/PostCard';
import socialService from '../../../services/socialService';
import { useAuth } from '../../context/AuthContext';

const SavedPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      setLoading(true);
      try {
        const response = await socialService.getSavedPosts();
        // Xử lý dữ liệu trả về linh hoạt:
        // Trường hợp 1: API trả về List<SocialPostDto> -> item chính là post
        // Trường hợp 2: API trả về List<SavedPost> -> item.post mới là post
        const formattedPosts = response.data.map(item => item.post ? item.post : item);
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Lỗi tải bài viết đã lưu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSavedPosts();
    }
  }, [user]);

  // Hàm xử lý khi user xóa bài viết (nếu bài đó là bài của chính user và họ xóa nó trong trang saved)
  const handlePostDelete = (deletedId) => {
    setPosts(posts.filter(p => p.id !== deletedId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="p-2 rounded-full hover:bg-white bg-gray-200 transition">
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <div>
             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Bookmark className="text-blue-600 fill-blue-600" /> Bài viết đã lưu
             </h1>
             <p className="text-sm text-gray-500">Danh sách các bài viết bạn đã lưu trữ</p>
          </div>
        </div>

        {/* Danh sách bài viết */}
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={{...post, isSaved: true}} // Đảm bảo trạng thái hiển thị là đã lưu
                currentUser={user}
                onDeleteSuccess={handlePostDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark size={40} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Chưa có bài viết nào</h3>
            <p className="text-gray-500 mt-2">
              Bạn chưa lưu bài viết nào. Hãy quay lại trang chủ và lưu những nội dung thú vị nhé!
            </p>
            <Link 
              to="/" 
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
            >
              Khám phá ngay
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default SavedPage;