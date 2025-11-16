import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx'; // <<< 1. IMPORT USEAUTH

// Schema yup (giữ nguyên)
const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, 'Mật khẩu cần ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
});

const Login = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = React.useState(null);
  const { login } = useAuth(); // <<< 2. LẤY HÀM LOGIN TỪ CONTEXT

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  // Hàm onSubmit ĐÃ SỬA ĐÚNG
  const onSubmit = async (data) => {
    setApiError(null);
    try {
      // 1. Backend trả về AuthResponseDto: { email, fullName, token }
      const response = await axios.post('/api/Auth/Login', data);
      
      // 2. Lấy "token" từ response.data
      // Đây là phần sửa lỗi quan trọng dựa trên AuthService.cs
      const { token } = response.data; 

      if (!token) {
        throw new Error('Không nhận được token từ server.');
      }

      // 3. Gọi hàm login của Context.
      // Hàm này sẽ tự lưu token, fetch profile và chuyển trang.
      await login(token);

    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        // Lỗi 401 (Unauthorized) từ AuthController trả về chuỗi
        setApiError(error.response.data || 'Email hoặc mật khẩu không chính xác.');
      } else {
        setApiError(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  };

  // (Phần JSX return giữ nguyên y hệt)
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
    <motion.div
      className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
       <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Chào mừng trở lại!</h2>
        <p className="mt-2 text-sm text-gray-600">Đăng nhập để tìm cơ hội mới</p>
      </div>
      
      {apiError && (
        <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <AlertTriangle className="flex-shrink-0 inline w-5 h-5 mr-3" />
          <span className="font-medium">{apiError}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email của bạn"
            {...register('email')}
            className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

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

        <div className="text-right text-sm">
          <Link 
            to="/forgot-password" 
            className="font-medium text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
        
        <motion.button
          type="submit"
          disabled={isSubmitting} 
          className="flex w-full justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? 'Đang xử lý...' : <>
            <LogIn className="h-5 w-5" /> Đăng nhập
          </> }
        </motion.button>

      </form>

      <p className="text-sm text-center text-gray-600">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;