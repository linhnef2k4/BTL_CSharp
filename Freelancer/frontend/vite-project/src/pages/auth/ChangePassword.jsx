import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';
import { useToast } from '../../context/ToastContext';

// --- Validation Schema ---
const schema = yup.object().shape({
  oldPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu hiện tại'),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .notOneOf([yup.ref('oldPassword')], 'Mật khẩu mới không được trùng với mật khẩu cũ'),
  confirmNewPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu mới')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
});

const ChangePassword = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  // State để ẩn/hiện password
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // Gọi API
      await authService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword
      });

      addToast('Đổi mật khẩu thành công!', 'success');
      reset(); // Xóa form
      
      // Tùy chọn: Có thể logout user hoặc giữ nguyên
      // navigate('/profile'); 

    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      const msg = error.response?.data || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.";
      addToast(msg, 'error');
    }
  };

  // Component Input tái sử dụng
  const PasswordInput = ({ label, id, registerName, error, show, setShow }) => (
    <div className="mb-5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock size={18} className="text-gray-400" />
        </div>
        <input
          id={id}
          type={show ? "text" : "password"}
          className={`w-full pl-10 pr-10 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          placeholder="••••••••"
          {...register(registerName)}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Đổi Mật Khẩu</h2>
          <p className="text-blue-100 text-sm mt-1">Bảo mật tài khoản của bạn</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <PasswordInput 
              label="Mật khẩu hiện tại" 
              id="oldPass" 
              registerName="oldPassword" 
              error={errors.oldPassword}
              show={showOld}
              setShow={setShowOld}
            />

            <PasswordInput 
              label="Mật khẩu mới" 
              id="newPass" 
              registerName="newPassword" 
              error={errors.newPassword}
              show={showNew}
              setShow={setShowNew}
            />

            <PasswordInput 
              label="Xác nhận mật khẩu mới" 
              id="confirmPass" 
              registerName="confirmNewPassword" 
              error={errors.confirmNewPassword}
              show={showConfirm}
              setShow={setShowConfirm}
            />

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)} // Quay lại trang trước
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {isSubmitting ? 'Đang lưu...' : 'Cập nhật mật khẩu'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;