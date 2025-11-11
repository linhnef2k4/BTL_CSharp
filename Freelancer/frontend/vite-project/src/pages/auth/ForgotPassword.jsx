// src/pages/auth/ForgotPassword.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';

// 1. Schema: Chỉ cần email
const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  // 2. Hàm xử lý
  const onSubmit = (data) => {
    console.log('Email gửi reset:', data.email);
    // (Sau này bạn sẽ gọi API ở đây)
    // await api.post('/auth/forgot-password', data);
    // (Sau đó có thể hiện thông báo "Đã gửi link, vui lòng check mail")
  };

  // 3. Animation (vẫn là nó)
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
        <h2 className="text-3xl font-bold text-gray-900">Quên mật khẩu?</h2>
        <p className="mt-2 text-sm text-gray-600">Đừng lo, nhập email để chúng tôi gửi link reset cho bạn.</p>
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
        
        {/* 5. Nút Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center items-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? 'Đang gửi...' : <>
            <Send className="h-5 w-5" /> Gửi link reset
          </> }
        </motion.button>
      </form>

      <p className="text-sm text-center text-gray-600">
        Nhớ ra rồi?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </motion.div>
  );
};

export default ForgotPassword;