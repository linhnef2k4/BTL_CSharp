import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { 
  User, Mail, Save, AlertTriangle, CheckCircle, 
  MapPin, TrendingUp, Award, Tag, Phone, Calendar, 
  Camera, FileText, UploadCloud, Download 
} from 'lucide-react';
// Import helper xử lý link ảnh
import { getAvatarUrl } from '../../utils/imageUrl';

const schema = yup.object().shape({
  fullName: yup.string().required('Vui lòng nhập họ tên'),
  phoneNumber: yup.string().nullable().matches(/^[0-9]+$/, "Số điện thoại chỉ chứa số").min(10, "Số không hợp lệ"),
  gender: yup.string().nullable(),
  dateOfBirth: yup.date().nullable().typeError('Ngày sinh không hợp lệ'),
  headline: yup.string().nullable().max(100, 'Tiêu đề quá dài'),
  location: yup.string().nullable(),
  level: yup.string().nullable(),
  skills: yup.string().nullable(),
});

const Profile = () => {
  const { user, refetchUser, isLoading: isAuthLoading } = useAuth();
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '', email: '', phoneNumber: '', gender: '', dateOfBirth: '',
      headline: '', location: '', level: '', skills: '',
    }
  });

  useEffect(() => {
    if (user) {
      let formattedDob = '';
      if (user.dateOfBirth) formattedDob = new Date(user.dateOfBirth).toISOString().split('T')[0];

      reset({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || '',
        dateOfBirth: formattedDob,
        headline: user.seeker?.headline || '',
        location: user.seeker?.location || '',
        level: user.seeker?.level || '',
        skills: user.seeker?.skills || '',
      });
    }
  }, [user, reset]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // API trả về Url, set ngay vào preview để hiển thị luôn
      setPreviewAvatar(response.data.Url || response.data.url); 
      setApiSuccess('Cập nhật ảnh đại diện thành công!');
      
      // Gọi refetch để cập nhật lại context
      await refetchUser(); 
    } catch (error) {
      console.error('Lỗi upload avatar:', error);
      setApiError('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCvChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingCv(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setApiSuccess('Tải lên CV thành công!');
      await refetchUser();
    } catch (error) {
      setApiError('Lỗi tải CV.');
    } finally {
      setIsUploadingCv(false);
    }
  };

  const onSubmit = async (data) => {
    setApiError(null);
    setApiSuccess(null);
    try {
      await api.put('/profile/me', data);
      setApiSuccess('Cập nhật thông tin thành công!');
      await refetchUser();
    } catch (error) {
      setApiError('Đã có lỗi xảy ra khi cập nhật.');
    }
  };

  if (isAuthLoading) return <div className="p-8 text-center">Đang tải thông tin...</div>;
  if (!user) return <div className="p-8 text-center">Vui lòng đăng nhập lại.</div>;

  // --- LOGIC SỬA LỖI HIỂN THỊ ẢNH ---
  // 1. Ưu tiên ảnh vừa upload (previewAvatar)
  // 2. Nếu không, lấy từ user.seeker.avatar (DTO Backend trả về là 'avatar' chữ thường)
  // 3. Phòng hờ trường hợp Backend trả về 'avatarUrl', lấy cả 2.
  const backendAvatar = user.seeker?.avatar || user.seeker?.avatarUrl; 
  
  // Dùng hàm getAvatarUrl để xử lý link đầy đủ
  const displayAvatar = previewAvatar || getAvatarUrl(backendAvatar, user.fullName);

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8 pb-20">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-800 mb-8">
        Hồ sơ cá nhân & Công việc
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-6">
          
          {/* === PHẦN HIỂN THỊ AVATAR === */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center flex flex-col items-center relative">
            <div className="relative group">
              <img 
                src={displayAvatar} 
                alt="Avatar"
                // GIỮ NGUYÊN CLASS CSS CỦA BẠN
                className="w-40 h-40 rounded-full border-4 border-blue-100 mb-4 object-cover shadow-sm"
                onError={(e) => {
                   // Nếu ảnh lỗi link, fallback về UI Avatar
                   e.target.onerror = null; 
                   e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`;
                }}
              />
              <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300">
                <Camera className="text-white w-8 h-8" />
              </label>
              <input type="file" id="avatar-upload" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploadingAvatar} />
            </div>
            
            {isUploadingAvatar && <p className="text-sm text-blue-600 font-medium animate-pulse">Đang tải ảnh lên...</p>}
            
            <h2 className="text-2xl font-bold text-gray-900 mt-2">{user.fullName}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="mt-3">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {user.role || 'Seeker'}
              </span>
            </div>
          </div>

          {/* === PHẦN CV === */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              CV / Hồ sơ năng lực
            </h3>
            
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
              {user.seeker?.resumeUrl ? (
                <div className="mb-4">
                  <p className="text-sm text-green-600 font-medium mb-2 flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Đã có CV trên hệ thống
                  </p>
                  <a 
                    href={getAvatarUrl(user.seeker?.resumeUrl)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Download className="w-4 h-4" /> Xem / Tải xuống CV
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">Bạn chưa tải lên CV nào.</p>
              )}

              <label className="block">
                <div className={`cursor-pointer inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 ${isUploadingCv ? 'opacity-50 cursor-not-allowed' : ''}`}>
                   <UploadCloud className="w-5 h-5 text-gray-400" />
                   {isUploadingCv ? 'Đang tải lên...' : 'Tải lên CV mới (PDF/Word)'}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleCvChange}
                  disabled={isUploadingCv}
                />
              </label>
            </div>
          </div>
        </motion.div>

        {/* FORM UPDATE (Giữ nguyên design) */}
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Thông tin chi tiết</h3>

            {apiSuccess && <div className="flex items-center p-4 text-sm text-green-800 bg-green-50 rounded-lg border border-green-200"><CheckCircle className="w-5 h-5 mr-2" /> {apiSuccess}</div>}
            {apiError && <div className="flex items-center p-4 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200"><AlertTriangle className="w-5 h-5 mr-2" /> {apiError}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email đăng nhập</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input {...register('email')} disabled className="pl-10 w-full p-2.5 bg-gray-100 border rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input type="text" {...register('fullName')} className={`pl-10 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input type="text" {...register('phoneNumber')} className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                <select {...register('gender')} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input type="date" {...register('dateOfBirth')} className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố / Nơi ở</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input type="text" {...register('location')} placeholder="Ví dụ: Hà Nội" className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="md:col-span-2 border-t pt-4 mt-2">
                <h4 className="text-md font-semibold text-gray-700 mb-4">Thông tin chuyên môn (Dành cho Tìm việc)</h4>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chức danh (Headline)</label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input type="text" {...register('headline')} placeholder="Ví dụ: Senior .NET Developer" className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cấp bậc hiện tại</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <select {...register('level')} className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">-- Chọn cấp bậc --</option>
                    {['Intern', 'Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kỹ năng (Skills)</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input type="text" {...register('skills')} placeholder="Nhập kỹ năng, cách nhau bởi dấu phẩy" className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

            </div>

            <div className="pt-4 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </motion.button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;