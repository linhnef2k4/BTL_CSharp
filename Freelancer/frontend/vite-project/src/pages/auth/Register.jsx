// src/pages/auth/Register.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, CheckSquare } from 'lucide-react'; // Thêm icon mới

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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  // 2. Hàm xử lý khi submit (tạm thời)
  const onSubmit = (data) => {
    console.log('Dữ liệu đăng ký:', data);
    // (Sau này bạn sẽ gọi API ở đây)
    // await api.post('/auth/register', data);
    // navigate('/login'); // Đăng ký xong thì bay về trang login
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
          disabled={isSubmitting}
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