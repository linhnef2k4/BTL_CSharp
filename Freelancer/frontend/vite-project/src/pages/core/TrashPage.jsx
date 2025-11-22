import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCcw, AlertTriangle, ArrowLeft, Loader2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import socialService from '../../../services/socialService';
import { formatTimeAgo } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

const TrashPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Lưu ID bài đang xử lý

  // 1. Fetch dữ liệu thùng rác
  useEffect(() => {
    const fetchTrash = async () => {
      setLoading(true);
      try {
        const response = await socialService.getTrash();
        setPosts(response.data);
      } catch (error) {
        console.error("Lỗi tải thùng rác:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTrash();
    }
  }, [user]);

  // 2. Xử lý Khôi phục
  const handleRestore = async (postId) => {
    setActionLoading(postId);
    try {
      await socialService.restorePost(postId);
      // Xóa khỏi danh sách thùng rác
      setPosts(prev => prev.filter(p => p.id !== postId));
      // Có thể thêm toast notification thành công ở đây
    } catch (error) {
      alert("Khôi phục thất bại.");
    } finally {
      setActionLoading(null);
    }
  };

  // 3. Xử lý Xóa vĩnh viễn
  const handleDeletePermanent = async (postId) => {
    if (!window.confirm("CẢNH BÁO: Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa vĩnh viễn?")) {
      return;
    }

    setActionLoading(postId);
    try {
      await socialService.deletePermanent(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      alert("Xóa thất bại.");
    } finally {
      setActionLoading(null);
    }
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
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        
        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="p-2 rounded-full hover:bg-white bg-gray-200 transition">
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <div>
             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Trash2 className="text-red-600" /> Thùng rác
             </h1>
             <p className="text-sm text-gray-500">Quản lý các bài viết bạn đã xóa</p>
          </div>
        </div>

        {/* --- DANH SÁCH BÀI VIẾT --- */}
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                
                {/* Header Card: Ngày tạo & Trạng thái */}
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      <Calendar size={12} />
                      Đăng {formatTimeAgo(post.createdDate)}
                   </div>
                   <div className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-md border border-red-100">
                      Đã xóa
                   </div>
                </div>

                {/* Content */}
                <div className="flex gap-4">
                   {/* Nếu có ảnh thì hiện ảnh nhỏ bên trái */}
                   {post.imageUrl && (
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                         <img src={post.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
                      </div>
                   )}
                   
                   {/* Nội dung text */}
                   <div className="flex-1">
                      <p className="text-gray-800 line-clamp-3 text-sm leading-relaxed">
                         {post.content}
                      </p>
                   </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                   <button 
                      onClick={() => handleRestore(post.id)}
                      disabled={actionLoading === post.id}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition disabled:opacity-50"
                   >
                      {actionLoading === post.id ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                      Khôi phục
                   </button>
                   
                   <button 
                      onClick={() => handleDeletePermanent(post.id)}
                      disabled={actionLoading === post.id}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                   >
                      <Trash2 size={16} />
                      Xóa vĩnh viễn
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
              <Trash2 size={40} className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Thùng rác trống</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              Tuyệt vời! Bạn không có bài viết nào trong thùng rác.
            </p>
            <Link 
              to="/" 
              className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-900 transition"
            >
              Quay về trang chủ
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrashPage;