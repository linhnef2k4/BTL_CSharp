import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Briefcase, Lock, Save, Phone, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import profileService from '../../../services/profileService';
import authService from '../../../services/authService';
import { useToast } from '../../context/ToastContext';

// Component con
const SectionCard = ({ title, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 mb-6"
  >
    <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
    {children}
  </motion.div>
);

const InputField = ({ label, name, register, errors, icon, disabled, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
      <input
        {...register(name)}
        {...props}
        disabled={disabled}
        className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all
          ${errors[name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}
        `}
      />
    </div>
    {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>}
  </div>
);

// --- SCHEMAS ---
const infoSchema = yup.object().shape({
  fullName: yup.string().required('Họ tên là bắt buộc'),
  phoneNumber: yup.string().nullable().matches(/^[0-9]*$/, 'SĐT chỉ chứa số').min(10, 'SĐT không hợp lệ'),
});

const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required('Mật khẩu cũ là bắt buộc'),
  newPassword: yup.string().min(6, 'Mật khẩu mới ít nhất 6 ký tự').required('Mật khẩu mới là bắt buộc'),
  confirmNewPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

const SettingsAccount = ({ profile, onRefresh }) => {
  const { addToast } = useToast();

  // FORM 1: INFO
  const { register: regInfo, handleSubmit: subInfo, formState: { errors: errInfo, isSubmitting: loadInfo }, reset: resetInfo } = useForm({
    resolver: yupResolver(infoSchema)
  });

  // FORM 2: PASSWORD
  const { register: regPass, handleSubmit: subPass, formState: { errors: errPass, isSubmitting: loadPass }, reset: resetPass } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // Load dữ liệu vào form khi profile thay đổi
  useEffect(() => {
    if (profile) {
      resetInfo({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
      });
    }
  }, [profile, resetInfo]);

  // Xử lý cập nhật thông tin
  const onInfoSubmit = async (data) => {
    try {
      // Gọi API UpdateProfile (Backend dùng chung DTO cho cả User và Company)
      // Ta gửi các trường User, các trường Company giữ nguyên (hoặc backend tự handle null)
      // Tốt nhất là merge data cũ
      const payload = {
        ...profile.employer, // Giữ lại data company cũ để không bị mất (nếu backend update kiểu replace)
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
      };

      await profileService.updateMyProfile(payload);
      addToast('Cập nhật thông tin cá nhân thành công!', 'success');
      onRefresh(); // Reload data cha
    } catch (error) {
        console.error(error);
        addToast('Cập nhật thất bại.', 'error');
    }
  };

  // Xử lý đổi mật khẩu
  const onPasswordSubmit = async (data) => {
    try {
      await authService.changePassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword
      });
      addToast('Đổi mật khẩu thành công!', 'success');
      resetPass(); 
    } catch (error) {
      const msg = error.response?.data || 'Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ.';
      addToast(msg, 'error');
    }
  };

  return (
    <>
      {/* FORM INFO */}
      <SectionCard title="Thông tin cá nhân">
        <form onSubmit={subInfo(onInfoSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Họ và Tên" name="fullName" register={regInfo} errors={errInfo} icon={<User size={18} />} />
              <InputField label="Số điện thoại" name="phoneNumber" register={regInfo} errors={errInfo} icon={<Phone size={18} />} />
          </div>
          <InputField label="Email Đăng nhập" name="email" register={regInfo} errors={errInfo} icon={<Mail size={18} />} disabled />
          
          <div className="flex justify-end">
            <button type="submit" disabled={loadInfo} className="btn-primary flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {loadInfo ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </SectionCard>

      {/* FORM PASSWORD */}
      <SectionCard title="Bảo mật & Mật khẩu">
        <form onSubmit={subPass(onPasswordSubmit)} className="space-y-5 max-w-xl">
          <InputField label="Mật khẩu cũ" name="oldPassword" type="password" register={regPass} errors={errPass} icon={<Lock size={18} />} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <InputField label="Mật khẩu mới" name="newPassword" type="password" register={regPass} errors={errPass} icon={<Lock size={18} />} />
             <InputField label="Xác nhận mật khẩu mới" name="confirmNewPassword" type="password" register={regPass} errors={errPass} icon={<Lock size={18} />} />
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loadPass} className="btn-secondary flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-50">
               {loadPass ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
               <span>Đổi mật khẩu</span>
            </button>
          </div>
        </form>
      </SectionCard>
    </>
  );
};

export default SettingsAccount;