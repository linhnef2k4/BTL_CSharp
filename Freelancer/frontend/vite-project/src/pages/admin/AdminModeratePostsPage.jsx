import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// "IMPORT" (IMPORT) "CÁI" (THE) "CARD" (CARD) "CHI TIẾT" (DETAIL) "TA" (WE) "VỪA" (JUST) "LÀM" (BUILT) (FILE 1/3)
import PostApprovalCard from '../../components/admin/PostApprovalCard'; 
import { User, Clock, Search, ShieldCheck } from 'lucide-react';

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "CHO" (FOR) "TRANG" (PAGE) "NÀY" (THIS) ---
// (Đây "là" (is) "các" (the) "bài" (posts) "post" (post) "chia sẻ" (sharing) "kinh nghiệm" (experience) "từ" (from) "Seeker" (Seeker) "chờ" (pending) "duyệt" (approve))
const MOCK_PENDING_POSTS = [
  { 
    id: 'post1', 
    author: {
      name: 'Seeker A (Chờ)',
      avatar: 'https://ui-avatars.com/api/?name=SA',
      time: '1 giờ trước',
    },
    content: 'Bài post này chứa từ khóa nhạy cảm: abc xyz. Admin hãy review kỹ.',
    image: 'https://placehold.co/600x400/cccccc/ffffff?text=Ảnh+Chờ+Duyệt+1',
  },
  { 
    id: 'post2', 
    author: {
      name: 'Seeker B (Chờ)',
      avatar: 'https://ui-avatars.com/api/?name=SB',
      time: '2 giờ trước',
    },
    content: 'Bài post này nội dung rất hay, chia sẻ kinh nghiệm phỏng vấn React rất tốt. Nên duyệt!',
    image: null, // Test "case" (case) "không" (no) "có" (have) "ảnh" (image)
  },
];
// ------------------------------------

// --- "Component" (Component) "con" (child) "cho" (for) "CỘT TRÁI" (LEFT COLUMN) ---
// "Đây" (This) "là" (is) "1" (one) "cái" (a) "item" (item) "trong" (in) "list" (list) "chờ" (pending)
const PendingItem = ({ post, isActive, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full text-left block p-3 rounded-lg border-b
                transition-colors duration-200
                ${isActive ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
  >
    <div className="flex items-center justify-between">
      {/* "Hiển thị" (Show) "nội dung" (content) "ngắn" (short) "của" (of) "post" (post) */}
      <h4 className="font-semibold text-sm text-gray-900 truncate">{post.content.substring(0, 30)}...</h4>
      <span className={`text-xs font-semibold ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
        {post.author.time}
      </span>
    </div>
    <p className="text-sm text-gray-600 truncate flex items-center gap-1">
      <User size={14} /> {post.author.name}
    </p>
  </button>
);
// ------------------------------------

const AdminModeratePostsPage = () => {
  // --- "BỘ NÃO" (BRAIN) "CỦA" (OF) "TRANG" (PAGE) "NÀY" (THIS) ---
  const [pendingPosts, setPendingPosts] = useState(MOCK_PENDING_POSTS);
  const [selectedPostId, setSelectedPostId] = useState(MOCK_PENDING_POSTS[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');

  // "Hàm" (Function) "Lọc" (Filter) "bằng" (by) "Search" (Search)
  const filteredList = pendingPosts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // "Tìm" (Find) "ra" (out) "data" (data) "của" (of) "thằng" (guy) "đang" (being) "được" (selected) "chọn" (selected)
  const selectedPost = pendingPosts.find(post => post.id === selectedPostId);

  // --- "LOGIC" (LOGIC) "DUYỆT" (APPROVE) / "TỪ CHỐI" (REJECT) ---
  
  const handleApprove = (postId) => {
    console.log(`ĐÃ DUYỆT post ID: ${postId}`);
    // (Sau "này" (later) "gọi" (call) "API" (API) "để" (to) "Duyệt" (Approve) "ở" (at) "đây" (here))
    
    // "Xóa" (Remove) "nó" (it) "khỏi" (from) "list" (list) "chờ" (pending)
    const newList = pendingPosts.filter(post => post.id !== postId);
    setPendingPosts(newList);
    
    // "Tự động" (Auto) "chọn" (select) "thằng" (guy) "tiếp theo" (next)
    setSelectedPostId(newList[0]?.id || null);
  };

  const handleReject = (postId, reason) => {
    console.log(`ĐÃ TỪ CHỐI post ID: ${postId}, Lý do: ${reason}`);
    // (Sau "này" (later) "gọi" (call) "API" (API) "để" (to) "Từ chối" (Reject) "với" (with) "lý do" (reason) "ở" (at) "đây" (here))
    
    // "Xóa" (Remove) "nó" (it) "khỏi" (from) "list" (list) "chờ" (pending)
    const newList = pendingPosts.filter(post => post.id !== postId);
    setPendingPosts(newList);
    
    // "Tự động" (Auto) "chọn" (select) "thằng" (guy) "tiếp theo" (next)
    setSelectedPostId(newList[0]?.id || null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Kiểm duyệt Bài Post</h1>
      
      {/* "LAYOUT" (LAYOUT) "2" (TWO) "CỘT" (COLUMNS) "CHIA" (SPLIT) "MÀN HÌNH" (SCREEN) */}
      {/* "Tái" (Re-) "sử dụng" (use) "layout" (layout) "y hệt" (exactly like) "trang" (page) "Duyệt Employer" (Approve Employer) */}
      <div className="flex h-[calc(100vh-12rem)] rounded-xl bg-white shadow-lg overflow-hidden">
        
        {/* CỘT 1: "DANH SÁCH" (LIST) "CHỜ" (PENDING) (BÊN TRÁI) */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* "Header" (Header) "Cột 1" (Column 1) (Search) */}
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock size={18} />
              Đang chờ duyệt ({filteredList.length})
            </h3>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo Tác giả, Nội dung..."
                className="w-full rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* "List" (List) "Cột 1" (Column 1) (Scrollable) */}
          <div className="flex-1 overflow-y-auto">
            {filteredList.length > 0 ? (
              filteredList.map(post => (
                <PendingItem
                  key={post.id}
                  post={post}
                  isActive={selectedPostId === post.id}
                  onSelect={() => setSelectedPostId(post.id)}
                />
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 p-4">
                {searchTerm ? 'Không tìm thấy...' : '🎉 Sạch! Không có Post nào chờ duyệt.'}
              </p>
            )}
          </div>
        </div>

        {/* CỘT 2: "CHI TIẾT" (DETAIL) "POST" (POST) (BÊN PHẢI) */}
        <div className="w-2/3">
          <AnimatePresence mode="wait">
            {selectedPost ? (
              // "NẾU" (IF) "CÓ" (HAVE) "POST" (POST) "ĐANG" (BEING) "CHỌN" (SELECTED), "GỌI" (CALL) "FILE 1/3" (FILE 1/3)
              <motion.div
                key={selectedPost.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <PostApprovalCard 
                  post={selectedPost}
                  onApprove={handleApprove} // "Truyền" (Pass) "hàm" (function) "Duyệt" (Approve) "xuống" (down)
                  onReject={handleReject}   // "Truyền" (Pass) "hàm" (function) "Từ chối" (Reject) "xuống" (down)
                />
              </motion.div>
            ) : (
              // "NẾU" (IF) "KHÔNG CÓ" (HAVE NO) "AI" (ANYONE) "TRONG" (IN) "LIST" (LIST) "ĐỂ" (TO) "CHỌN" (SELECT)
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <ShieldCheck size={40} className="mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    {pendingPosts.length > 0 
                      ? "Chọn một Bài Post để xem chi tiết" 
                      : (searchTerm ? 'Không tìm thấy...' : '🎉 Sạch! Không có Post nào chờ duyệt.')
                    }
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminModeratePostsPage;