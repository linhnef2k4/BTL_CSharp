// src/pages/auth/Login.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react'; // Dùng icon cho đẹp

// 1. Định nghĩa schema validation (luật lệ của form)
const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, 'Mật khẩu cần ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu'),
});

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  // 2. Hàm xử lý khi submit (tạm thời chỉ console.log)
  const onSubmit = (data) => {
    console.log('Dữ liệu form:', data);
    // (Sau này bạn sẽ gọi API ở đây)
    // await api.post('/auth/login', data);
    // navigate('/'); 
  };

  // 3. Định nghĩa animation cho cái thẻ form
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1] // Hiệu ứng "nảy" nhẹ
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
        <h2 className="text-3xl font-bold text-gray-900">Chào mừng trở lại!</h2>
        <p className="mt-2 text-sm text-gray-600">Đăng nhập để tìm cơ hội mới</p>
      </div>
      
      {/* 4. Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Trường Email */}
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

        <div className="text-right text-sm">
          <Link 
            to="/forgot-password" 
            className="font-medium text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>
        
        {/* 5. Nút Submit (cũng có animation) */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          whileHover={{ scale: 1.03 }} // <- Animation khi di chuột
          whileTap={{ scale: 0.98 }} // <- Animation khi nhấn
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