import React, { useEffect, useState } from 'react';
// <<< 1. SỬA LỖI: Đảm bảo đường dẫn đúng, ví dụ:
import { useAuth } from '../../context/AuthContext'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  User, Mail, Save, AlertTriangle, CheckCircle, 
  MapPin, TrendingUp, Award, Tag 
} from 'lucide-react';

// 1. Schema validation MỚI
const schema = yup.object().shape({
  fullName: yup.string().required('Vui lòng nhập họ tên'),
  headline: yup.string().nullable().max(100, 'Tiêu đề quá dài (tối đa 100 ký tự)'),
  location: yup.string().nullable(),
  // <<< 2. SỬA LỖI: yP -> yup
  level: yup.string().oneOf(
    ['', 'Intern', 'Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', null], // Thêm null
    'Cấp bậc không hợp lệ'
  ).nullable(),
  skills: yup.string().nullable(),
});

const Profile = () => {
  // 2. Lấy user và hàm refetch từ Context
  const { user, refetchUser, isLoading: isAuthLoading } = useAuth();
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    // Giá trị mặc định
    defaultValues: {
      fullName: '',
      email: '',
      headline: '',
      location: '',
      level: '',
      skills: '',
    }
  });

  // 3. Populate form khi có dữ liệu user (ĐỌC TỪ user.seeker)
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        email: user.email || '',
        // Đọc từ object user.seeker lồng bên trong
        headline: user.seeker?.headline || '',
        location: user.seeker?.location || '',
        level: user.seeker?.level || '',
        skills: user.seeker?.skills || '',
      });
    }
  }, [user, reset]); // Chạy lại khi 'user' thay đổi

  // 4. Hàm xử lý submit
  const onSubmit = async (data) => {
    setApiError(null);
    setApiSuccess(null);
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      setApiError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      return;
    }

    // Chuẩn bị payload khớp với UpdateProfileRequestDto
    const payload = {
      fullName: data.fullName,
      headline: data.headline,
      location: data.location,
      level: data.level,
      skills: data.skills,
    };

    try {
      // Gọi API Update (HttpPut /api/profile/me)
      await axios.put('/api/profile/me', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiSuccess('Cập nhật thông tin thành công!');
      
      // QUAN TRỌNG: Gọi refetch để AuthContext lấy data mới
      await refetchUser();

    } catch (error) {
      console.error('Lỗi cập nhật profile:', error);
      setApiError(error.response?.data || 'Đã có lỗi xảy ra khi cập nhật.');
    }
  };

  // 5. Trạng thái Loading ban đầu
  if (isAuthLoading) {
    return <div className="p-8 text-center">Đang tải thông tin...</div>;
  }

  // Nếu check xong mà vẫn không có user
  if (!user) {
    return <div className="p-8 text-center text-red-600">Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</div>;
  }

  // 6. Giao diện
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-8"
      >
        Thông tin cá nhân & Hồ sơ Seeker
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === CỘT BÊN TRÁI (THÔNG TIN CƠ BẢN) === */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center flex flex-col items-center">
            <img 
              src={user.seeker?.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}&background=random&color=fff&size=128&bold=true`} 
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-200 mb-4 object-cover"
            />
            <h2 className="text-2xl font-semibold text-gray-900">{user.fullName}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {user.role || 'Seeker'} 
            </span>
          </div>
        </motion.div>

        {/* === CỘT BÊN PHẢI (FORM CẬP NHẬT) === */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 rounded-2xl shadow-xl space-y-5">
            
            {/* Thông báo thành công/thất bại */}
            {apiSuccess && (
              <div className="flex items-center p-3 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                <CheckCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
                <span className="font-medium">{apiSuccess}</span>
              </div>
            )}
            {apiError && (
              <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                <AlertTriangle className="flex-shrink-0 inline w-5 h-5 mr-3" />
                <span className="font-medium">{apiError}</span>
              </div>
            )}

            {/* Email (Read-only) */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Mail className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                {...register('email')}
                readOnly
                disabled
                className="w-full py-3 pl-10 pr-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Họ và Tên */}
            <div className="relative">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
              <User className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="fullName"
                {...register('fullName')}
                className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
            </div>

            {/* --- CÁC TRƯỜNG SEEKER MỚI --- */}
            
            {/* Tiêu đề hồ sơ (Headline) */}
            <div className="relative">
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề hồ sơ</label>
              <Award className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="headline"
                {...register('headline')}
                placeholder="Ví dụ: Senior React Developer"
                className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.headline ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.headline && <p className="mt-1 text-xs text-red-600">{errors.headline.message}</p>}
            </div>
            
            {/* Vị trí & Cấp bậc */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    {...register('location')}
                    placeholder="Ví dụ: Hà Nội"
                    className="w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                {/* <<< 3. SỬA LỖI: </lebel> -> </label> */}
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Cấp bậc</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    id="level"
                    {...register('level')}
                    className="w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">-- Chọn cấp bậc --</option>
                    <option value="Intern">Intern</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Junior">Junior</option>
                    {/* <<< 4. SỬA LỖI: valueD -> value */}
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Kỹ năng (Skills) */}
            <div className="relative">
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Các kỹ năng</label>
              <Tag className="absolute left-3 top-1/2 mt-3 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="skills"
                {...register('skills')}
                placeholder="Các kỹ năng cách nhau bằng dấu phẩy"
                className="w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
              />
              {/* <<< 5. SỬA LỖI: </Such> -> </p> */}
              <p className="mt-1 text-xs text-gray-500">Ví dụ: React, Nodejs, SQL, AWS</p>
            </div>
            
            {/* Nút Submit */}
            <div className="text-right">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="h-5 w-5" />
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