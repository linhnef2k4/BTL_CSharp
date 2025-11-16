import React, { useState } from 'react'; // <<< Thêm useState
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, CheckSquare, AlertTriangle, CheckCircle } from 'lucide-react'; // <<< Thêm icon báo lỗi/thành công
import axios from 'axios'; // <<< Thêm axios

// 1. Schema validation cho Register
const schema = yup.object().shape({
  fullName: yup.string().required('Vui lòng nhập họ tên'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, 'Mật khẩu cần ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp') // <-- Check pass có khớp không
    .required('Vui lòng xác nhận mật khẩu'),
});

const Register = () => {
  const navigate = useNavigate();
  // <<< Thêm state để lưu lỗi/thành công từ API
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  // 2. Hàm xử lý khi submit (ĐÃ CẬP NHẬT)
  const onSubmit = async (data) => {
    setApiError(null);
    setApiSuccess(null);

    // DTO của bạn có thể chỉ cần 3 trường này.
    // confirmPassword chỉ dùng để validate ở frontend.
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };

    try {
      // Nhờ proxy, ta chỉ cần gọi '/api/...'
      const response = await axios.post('/api/Auth/register', payload);

      // Đăng ký thành công, backend trả về "Đăng ký thành công!"
      setApiSuccess(response.data || 'Đăng ký thành công! Sẽ chuyển đến trang đăng nhập...');
      
      // Chờ 2 giây để user đọc thông báo, sau đó chuyển về trang login
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      // Xử lý lỗi
      console.error('Lỗi đăng ký:', error);
      if (error.response && error.response.status === 400) {
        // Lỗi 400 (BadRequest) từ backend (vd: Email đã tồn tại)
        setApiError(error.response.data || 'Email đã tồn tại hoặc thông tin không hợp lệ.');
      } else {
        // Lỗi server hoặc mạng
        setApiError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  };

  // 3. Animation (giữ nguyên, tái sử dụng)
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    },
  };

  return (
    // Thẻ (card) form với animation
    <motion.div
      className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h2>
        <p className="mt-2 text-sm text-gray-600">Bắt đầu hành trình mới của bạn</p>
      </div>
      
      {/* <<< THÊM VÀO: HIỂN THỊ LỖI API */}
      {apiError && (
        <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <AlertTriangle className="flex-shrink-0 inline w-5 h-5 mr-3" />
          <span className="font-medium">{apiError}</span>
        </div>
      )}
      
      {/* <<< THÊM VÀO: HIỂN THỊ THÀNH CÔNG */}
      {apiSuccess && (
        <div className="flex items-center p-3 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          <CheckCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
          <span className="font-medium">{apiSuccess}</span>
        </div>
      )}
      
      {/* 4. Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Trường Họ Tên */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Họ và tên"
            {...register('fullName')}
            className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
        </div>

        {/* Trường Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        {/* Trường Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="password"
            placeholder="Mật khẩu"
            {...register('password')}
            className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        {/* Trường Confirm Password */}
        <div className="relative">
          <CheckSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            {...register('confirmPassword')}
            className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
        </div>
        
        {/* 5. Nút Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting || !!apiSuccess} // <<< CẬP NHẬT: Vô hiệu hóa khi đang gửi hoặc đã thành công
          className="flex w-full justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
        </motion.button>
      </form>

      <p className="text-sm text-center text-gray-600">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </motion.div>
  );
};

export default Register;