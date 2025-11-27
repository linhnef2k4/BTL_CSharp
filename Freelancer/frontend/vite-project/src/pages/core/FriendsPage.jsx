import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MessageCircle, UserPlus, UserCheck, X, 
  Loader2, Users 
} from 'lucide-react';
import friendService from '../../../services/friendService';

// Helper Avatar
const getAvatarUrl = (fullName, avatarUrl) => {
  if (avatarUrl) return avatarUrl;
  const name = fullName ? fullName.replace(/\s/g, '+') : 'User';
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
};

const FriendsPage = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Load Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [friendsRes, requestsRes] = await Promise.all([
          friendService.getFriends(),
          friendService.getPendingRequests()
        ]);
        setFriends(friendsRes.data);
        setRequests(requestsRes.data);
      } catch (error) {
        console.error("Lỗi tải danh sách bạn bè:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Xử lý Chấp nhận kết bạn (ĐÃ SỬA)
  const handleAccept = async (friendshipId) => {
    try {
      await friendService.acceptRequest(friendshipId);
      
      // Tìm request vừa chấp nhận để chuyển sang list bạn bè
      const acceptedRequest = requests.find(r => r.friendshipId === friendshipId); // Sửa: r.id -> r.friendshipId
      
      if (acceptedRequest) {
         // Tạo object friend mới từ request info (Mapping lại cho khớp cấu trúc FriendDto)
         const newFriend = {
             friendId: acceptedRequest.requesterId,
             friendFullName: acceptedRequest.requesterFullName, // Sửa: requesterName -> requesterFullName
             friendHeadline: acceptedRequest.requesterHeadline,
             friendAvatarUrl: null // DTO Request chưa có avatar, để null cho helper tự xử lý
         };
         
         setFriends([newFriend, ...friends]);
         setRequests(requests.filter(r => r.friendshipId !== friendshipId)); // Sửa: r.id -> r.friendshipId
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi chấp nhận.");
    }
  };

  // 3. Xử lý Từ chối (ĐÃ SỬA)
  const handleReject = async (friendshipId) => {
    try {
      await friendService.rejectRequest(friendshipId);
      setRequests(requests.filter(r => r.friendshipId !== friendshipId)); // Sửa: r.id -> r.friendshipId
    } catch (error) {
      alert("Lỗi kết nối.");
    }
  };

  // 4. Lọc bạn bè theo ô tìm kiếm
  const filteredFriends = friends.filter(friend => 
    friend.friendFullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        
        {/* --- HEADER --- */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" /> Bạn bè
          </h1>
          {/* Ô Tìm kiếm bạn bè */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Tìm kiếm trong danh sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>

        {/* --- PHẦN 1: LỜI MỜI KẾT BẠN (PENDING) --- */}
        {requests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-red-500" /> Lời mời kết bạn ({requests.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {requests.map((req) => (
                // Sửa key: req.friendshipId thay vì req.id
                <div key={req.friendshipId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/user/${req.requesterId}`)}>
                    <img 
                      // Sửa: requesterFullName thay vì requesterName
                      src={getAvatarUrl(req.requesterFullName, null)} 
                      alt="avatar" 
                      className="w-14 h-14 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 hover:text-blue-600 transition line-clamp-1">
                        {req.requesterFullName}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{req.requesterHeadline || "Thành viên"}</p>
                      {/* DTO chưa trả về ngày gửi, có thể bỏ hoặc mock */}
                      <p className="text-xs text-gray-400 mt-1">Đã gửi yêu cầu</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button 
                      // Sửa: req.friendshipId
                      onClick={() => handleAccept(req.friendshipId)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                    >
                      Chấp nhận
                    </button>
                    <button 
                      // Sửa: req.friendshipId
                      onClick={() => handleReject(req.friendshipId)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PHẦN 2: DANH SÁCH BẠN BÈ --- */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <UserCheck size={20} className="text-green-600" /> Danh sách bạn bè ({filteredFriends.length})
          </h2>
          
          {filteredFriends.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
              <img src="https://illustrations.popsy.co/gray/surr-waiting.svg" className="h-40 mx-auto mb-4 opacity-70" alt="No friends" />
              <p className="text-gray-500">
                {searchTerm ? 'Không tìm thấy bạn bè nào khớp với từ khóa.' : 'Bạn chưa có người bạn nào. Hãy kết nối thêm nhé!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredFriends.map((friend) => (
                <div key={friend.friendId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group relative">
                  
                  {/* Nút Nhắn tin */}
                  <button 
                    onClick={(e) => {
                         e.stopPropagation();
                         // Giả lập gửi chatWith sang MessagesPage
                         navigate('/messages', { 
                             state: { 
                                 chatWith: {
                                     id: friend.friendId,
                                     fullName: friend.friendFullName,
                                     avatar: friend.friendAvatarUrl
                                 } 
                             } 
                         });
                    }}
                    className="absolute top-3 right-3 p-2 bg-gray-50 rounded-full text-blue-600 hover:bg-blue-100 hover:scale-110 transition z-10 border border-gray-200"
                    title="Nhắn tin"
                  >
                    <MessageCircle size={18} />
                  </button>

                  <div className="p-5 flex flex-col items-center text-center cursor-pointer" onClick={() => navigate(`/user/${friend.friendId}`)}>
                    <img 
                      src={getAvatarUrl(friend.friendFullName, friend.friendAvatarUrl)} 
                      alt={friend.friendFullName} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 mb-3 shadow-sm group-hover:scale-105 transition-transform duration-300"
                    />
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition line-clamp-1 px-2">
                      {friend.friendFullName}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1 px-2">
                      {friend.friendHeadline || "Thành viên"}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center text-sm">
                     <span className="text-gray-400 font-medium text-xs uppercase tracking-wide">Bạn bè</span>
                     <Link to={`/user/${friend.friendId}`} className="text-blue-600 font-medium hover:underline text-xs">
                        Xem trang cá nhân
                     </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FriendsPage;