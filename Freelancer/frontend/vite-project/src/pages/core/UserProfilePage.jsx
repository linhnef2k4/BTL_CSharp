import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Briefcase, Calendar, FileText, MessageCircle, 
  UserPlus, Loader2, CheckCircle, Download, Award, Edit
} from 'lucide-react';

import profileService from '../../../services/profileService';
import socialService from '../../../services/socialService';
import friendService from '../../../services/friendService';
import { useAuth } from '../../context/AuthContext';
import PostCard from '../../components/shared/PostCard';

const DEFAULT_COVER = "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1600&q=80";

const getAvatarUrl = (fullName, avatarUrl) => {
  if (avatarUrl) return avatarUrl;
  const name = fullName ? fullName.replace(/\s/g, '+') : 'User';
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
};

const UserProfilePage = () => {
  const { id } = useParams(); 
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const profileId = id || currentUser?.id;
  const isOwnProfile = currentUser && Number(currentUser.id) === Number(profileId);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  // --- 1. LOAD DATA (SỬ DỤNG WORKAROUND) ---
  useEffect(() => {
    if (!profileId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // A. Lấy thông tin Profile (API chuẩn)
        const profileRes = await profileService.getUserProfile(profileId);
        setProfile(profileRes.data);

        // B. Lấy bài viết (WORKAROUND: Lấy Feed rồi lọc client-side)
        try {
            // Thay vì gọi getPostsByAuthor (chưa có), ta gọi getFeed (lấy tất cả)
            const feedRes = await socialService.getFeed();
            
            // Lọc thủ công: Chỉ lấy bài có authorId trùng với profileId đang xem
            const userPosts = feedRes.data.filter(post => post.authorId === Number(profileId));
            
            setPosts(userPosts);
        } catch (postError) {
            console.warn("Lỗi tải bài viết (Workaround):", postError);
            setPosts([]); 
        }

      } catch (error) {
        console.error("Lỗi tải profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profileId]);

  // --- ACTIONS ---
  const handleSendFriendRequest = async () => {
    if (!currentUser) return alert("Vui lòng đăng nhập!");
    try {
      await friendService.sendRequest(profileId);
      setRequestSent(true);
    } catch (error) {
      alert("Đã gửi yêu cầu hoặc đã là bạn bè.");
    }
  };

  const handleMessage = () => {
    if (!currentUser) return alert("Vui lòng đăng nhập!");
    navigate('/messages', { state: { chatWith: { 
        friendId: profile.id, 
        friendFullName: profile.fullName, 
        friendAvatarUrl: profile.seeker?.avatarUrl || profile.seeker?.avatar // Fallback
    }}});
  };

  const handlePostDelete = (deletedId) => {
    setPosts(posts.filter(p => p.id !== deletedId));
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  if (!profile) return <div className="min-h-screen flex justify-center items-center text-gray-500">Không tìm thấy người dùng (ID: {profileId}).</div>;

  // Xử lý dữ liệu JSON trả về
  const details = profile.seeker || profile.employer || {};
  // Fix lỗi avatar: API trả về 'avatar' nhưng code cũ dùng 'avatarUrl'
  const avatarSrc = details.avatarUrl || details.avatar || details.companyLogoUrl;
  const roleDisplay = profile.role === 'Employer' ? 'Nhà tuyển dụng' : 'Thành viên';

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      
      {/* HEADER SECTION */}
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-6xl mx-auto">
          {/* Cover */}
          <div className="relative h-64 md:h-80 w-full bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden rounded-b-xl">
            <img src={DEFAULT_COVER} alt="Cover" className="w-full h-full object-cover opacity-90" />
          </div>

          {/* Info */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row items-end -mt-12 md:-mt-16 gap-6">
              
              {/* Avatar */}
              <div className="relative group">
                <div className="p-1 bg-white rounded-full">
                    <img 
                        src={getAvatarUrl(profile.fullName, avatarSrc)} 
                        alt={profile.fullName} 
                        className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200"
                    />
                </div>
                {details.isVip && (
                   <div className="absolute bottom-4 right-4 bg-yellow-400 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                      <Award size={22} />
                   </div>
                )}
              </div>

              {/* Name */}
              <div className="flex-1 mb-2 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                    {profile.fullName}
                    {details.isVip && <CheckCircle size={20} className="text-blue-500" />}
                </h1>
                <p className="text-gray-600 font-medium text-lg mt-1">
                  {details.headline || (profile.role === "Employer" ? details.companyName : roleDisplay)}
                </p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 text-sm mt-2">
                    {details.location && <span className="flex items-center gap-1"><MapPin size={16} /> {details.location}</span>}
                    <span className="flex items-center gap-1"><Briefcase size={16} /> {roleDisplay}</span>
                    <span className="flex items-center gap-1"><Calendar size={16} /> Tham gia {profile.createdDate ? new Date(profile.createdDate).getFullYear() : 2024}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mb-4 w-full md:w-auto justify-center">
                {isOwnProfile ? (
                    <Link to="/profile" className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition border border-gray-300">
                        <Edit size={18} /> Sửa thông tin
                    </Link>
                ) : (
                    <>
                        {!requestSent ? (
                            <button onClick={handleSendFriendRequest} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md">
                                <UserPlus size={18} /> Kết bạn
                            </button>
                        ) : (
                            <button disabled className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-600 font-semibold rounded-lg cursor-default">
                                <CheckCircle size={18} /> Đã gửi
                            </button>
                        )}
                        <button onClick={handleMessage} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition border border-gray-300">
                            <MessageCircle size={18} /> Nhắn tin
                        </button>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: INFO */}
        <div className="space-y-6">
           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-xl text-gray-800 mb-4">Giới thiệu</h3>
              <div className="space-y-3 text-gray-700 text-sm">
                 {details.rank && <div className="flex gap-3"><Award size={20} className="text-gray-400" /><span>Cấp bậc: <strong>{details.rank}</strong></span></div>}
                 {details.level && <div className="flex gap-3"><Briefcase size={20} className="text-gray-400" /><span>Trình độ: <strong>{details.level}</strong></span></div>}
                 {details.yearsOfExperience > 0 && <div className="flex gap-3"><Calendar size={20} className="text-gray-400" /><span>Kinh nghiệm: <strong>{details.yearsOfExperience} năm</strong></span></div>}
              </div>
           </div>

           {details.skills && (
             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl text-gray-800 mb-3">Kỹ năng</h3>
                <div className="flex flex-wrap gap-2">
                   {details.skills.split(',').map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase">{skill.trim()}</span>
                   ))}
                </div>
             </div>
           )}

           {details.resumeUrl && (
             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-xl text-gray-800 mb-3">CV</h3>
                <a href={details.resumeUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition">
                   <div className="bg-red-100 p-2.5 rounded-lg text-red-600"><FileText size={24} /></div>
                   <div className="flex-1 overflow-hidden">
                      <div className="font-semibold text-gray-800 truncate">Xem CV</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1"><Download size={12} /> Nhấn để xem</div>
                   </div>
                </a>
             </div>
           )}
        </div>

        {/* RIGHT: POSTS */}
        <div className="lg:col-span-2">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">Bài viết</h3>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{posts.length}</span>
           </div>

           {posts.length > 0 ? (
              <div className="space-y-5">
                 {posts.map(post => (
                    <PostCard key={post.id} post={post} currentUser={currentUser} onDeleteSuccess={handlePostDelete} />
                 ))}
              </div>
           ) : (
              <div className="bg-white p-10 rounded-xl text-center shadow-sm border border-gray-100">
                 <p className="text-gray-500">Người dùng này chưa đăng nội dung nào.</p>
              </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default UserProfilePage;