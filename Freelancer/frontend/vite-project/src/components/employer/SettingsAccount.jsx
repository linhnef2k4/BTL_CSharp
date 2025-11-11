import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Briefcase, Lock, Save } from 'lucide-react';
import { motion } from 'framer-motion';

// --- "Linh kiện" (Component) "con" (child) "cho" (for) "nó" (it) "sạch" (clean) ---
// 1. "Card" (Card) "Bọc" (Wrapper)
const SectionCard = ({ title, children }) => (
  <motion.div
    className="rounded-xl bg-white p-6 shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">{title}</h2>
    {children}
  </motion.div>
);

// 2. "Input" (Input) "Xịn" (Pro)
const InputField = ({ label, name, register, errors, icon, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        {icon}
      </span>
      <input
        {...register(name)}
        {...props}
        className={`w-full rounded-lg border py-2.5 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
      />
    </div>
    {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>}
  </div>
);
// ------------------------------------

// --- "Logic" (Logic) "Validate" (Validation) ---
// 1. "Form" (Form) "Thông tin" (Info)
const infoSchema = yup.object().shape({
  hrName: yup.string().required('Họ tên là bắt buộc'),
  hrTitle: yup.string().required('Chức vụ là bắt buộc'),
});

// 2. "Form" (Form) "Mật khẩu" (Password)
const passwordSchema = yup.object().shape({
  password: yup.string().required('Mật khẩu cũ là bắt buộc'),
  newPassword: yup.string().min(6, 'Mật khẩu mới ít nhất 6 ký tự').required('Mật khẩu mới là bắt buộc'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu mới không khớp')
    .required('Vui lòng xác nhận mật khẩu mới'),
});
// ---------------------------------

const SettingsAccount = () => {
  // "Dùng" (Use) "2" (two) "cái" (the) "form" (forms) "riêng biệt" (separate) "cho" (to be) "nó" (it) "sạch" (clean)
  const { register: registerInfo, handleSubmit: handleSubmitInfo, formState: { errors: errorsInfo, isSubmitting: isSubmittingInfo } } = useForm({
    resolver: yupResolver(infoSchema),
    // "Load" (Load) "data" (data) "giả" (mock) (sau "này" (later) "lấy" (get) "từ" (from) "API" (API))
    defaultValues: {
      hrName: 'Phan Bá Khánh Linh',
      hrEmail: 'linhpbk@fpt.com.vn',
      hrTitle: 'HR Manager'
    }
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword }, reset: resetPassword } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  // "Hàm" (Function) "Submit" (Submit) "cho" (for) "Form 1" (Form 1)
  const onInfoSubmit = (data) => {
    console.log('Cập nhật Thông tin Cá nhân:', data);
    // (Gọi (Call) API "cập nhật" (update) "info" (info) "ở" (at) "đây" (here))
  };

  // "Hàm" (Function) "Submit" (Submit) "cho" (for) "Form 2" (Form 2)
  const onPasswordSubmit = (data) => {
    console.log('Đổi Mật khẩu:', data);
    // (Gọi (Call) API "đổi" (change) "mật khẩu" (password) "ở" (at) "đây" (here))
    resetPassword(); // "Xóa" (Clear) "form" (form) "mật khẩu" (password) "sau" (after) "khi" (when) "submit" (submit)
  };

  return (
    <div className="space-y-6">
      
      {/* CARD 1: THÔNG TIN CÁ NHÂN */}
      <SectionCard title="Thông tin cá nhân (HR)">
        <form onSubmit={handleSubmitInfo(onInfoSubmit)} className="space-y-4">
          <InputField
            label="Họ và Tên"
            name="hrName"
            register={registerInfo}
            errors={errorsInfo}
            icon={<User size={18} />}
          />
          <InputField
            label="Email Đăng nhập"
            name="hrEmail"
            register={registerInfo}
            errors={errorsInfo}
            icon={<Mail size={18} />}
            disabled // "Không" (Don't) "cho" (let) "đổi" (change) "email" (email) "username" (username)
            className="bg-gray-100 cursor-not-allowed"
          />
          <InputField
            label="Chức vụ"
            name="hrTitle"
            register={registerInfo}
            errors={errorsInfo}
            icon={<Briefcase size={18} />}
            placeholder="VD: Chuyên viên Tuyển dụng"
          />
          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmittingInfo}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 
                         font-semibold text-white shadow-lg transition-all 
                         hover:scale-105 hover:bg-blue-700 
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />
              {isSubmittingInfo ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </SectionCard>

      {/* CARD 2: BẢO MẬT & MẬT KHẨU */}
      <SectionCard title="Bảo mật & Mật khẩu">
        <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
          <InputField
            label="Mật khẩu cũ"
            name="password"
            type="password"
            register={registerPassword}
            errors={errorsPassword}
            icon={<Lock size={18} />}
            placeholder="Nhập mật khẩu hiện tại"
          />
          <InputField
            label="Mật khẩu mới"
            name="newPassword"
            type="password"
            register={registerPassword}
            errors={errorsPassword}
            icon={<Lock size={18} />}
            placeholder="Ít nhất 6 ký tự"
          />
          <InputField
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            type="password"
            register={registerPassword}
            errors={errorsPassword}
            icon={<Lock size={18} />}
            placeholder="Nhập lại mật khẩu mới"
          />
          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-700 px-5 py-2.5 
                         font-semibold text-white shadow-lg transition-all 
                         hover:scale-105 hover:bg-gray-800 
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />
              {isSubmittingPassword ? 'Đang lưu...' : 'Đổi Mật khẩu'}
            </button>
          </div>
        </form>
      </SectionCard>

    </div>
  );
};

export default SettingsAccount;