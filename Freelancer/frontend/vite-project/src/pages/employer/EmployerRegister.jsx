import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { Building, Users, Mail, Phone, Lock, Hash, Globe, User } from 'lucide-react'; // <-- ĐÃ SỬA (Thêm "User")

// --- Validation "Chuẩn" ---
const schema = yup.object().shape({
  companyName: yup.string().required('Tên công ty là bắt buộc'),
  taxCode: yup
    .string()
    .required('Mã số thuế là bắt buộc')
    .matches(/^[0-9]{10}$/, 'Mã số thuế phải là 10 chữ số'),
  companySize: yup.string().required('Vui lòng chọn quy mô'),
  website: yup.string().url('URL website không hợp lệ').required('Website là bắt buộc'),
  
  hrName: yup.string().required('Tên người liên hệ là bắt buộc'),
  hrEmail: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  hrPhone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ'),

  password: yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Mật khẩu là bắt buộc'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

// --- Component Input "Xịn" (cho "sạch") ---
const InputField = ({ label, id, icon, error, register, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      <input
        id={id}
        {...register}
        {...props}
        className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
  </div>
);

// --- Component Form Chính ---
const EmployerRegister = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log('Dữ liệu Đăng ký Employer:', data);
    // (Sau này bạn sẽ gọi API ở đây)
    // await api.post('/employer/register', data);
    
    // Điều hướng đến trang Dashboard "xịn"
    navigate('/employer/dashboard'); 
  };

  return (
    // Chúng ta "fix" lại padding (py-16)
    // vì nó KHÔNG còn nằm trong `MainLayout` (có Navbar) nữa
    <div className="py-16">
      <div className="container mx-auto max-w-4xl">
        <div className="rounded-xl bg-white p-8 shadow-2xl md:p-12">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Đăng ký Tài khoản Nhà Tuyển Dụng</h1>
            <p className="mt-2 text-gray-600">
              Tham gia và tìm kiếm hàng ngàn ứng viên tiềm năng ngay hôm nay!
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* --- 1. Thông tin Công ty --- */}
            <fieldset className="space-y-4 rounded-lg border p-5">
              <legend className="-ml-1 px-2 text-lg font-semibold text-blue-700">
                <div className="flex items-center space-x-2">
                  <Building size={20} />
                  <span>Thông tin công ty</span>
                </div>
              </legend>
              
              <InputField
                label="Tên công ty"
                id="companyName"
                icon={<Building size={16} className="text-gray-400" />}
                register={register('companyName')}
                error={errors.companyName}
                placeholder="VD: Công ty Cổ phần ABC"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Mã số thuế"
                  id="taxCode"
                  icon={<Hash size={16} className="text-gray-400" />}
                  register={register('taxCode')}
                  error={errors.taxCode}
                  placeholder="10 chữ số (Bắt buộc)"
                />
                <div>
                  <label htmlFor="companySize" className="block text-sm font-semibold text-gray-700 mb-1">
                    Quy mô công ty
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Users size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="companySize"
                      {...register('companySize')}
                      className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm shadow-sm
                                  focus:outline-none focus:ring-2 focus:ring-blue-500
                                  ${errors.companySize ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">-- Chọn quy mô --</option>
                      <option value="1-20">1 - 20 nhân viên</option>
                      <option value="21-100">21 - 100 nhân viên</option>
                      <option value="101-500">101 - 500 nhân viên</option>
                      <option value="501+">Trên 500 nhân viên</option>
                    </select>
                  </div>
                  {errors.companySize && <p className="mt-1 text-xs text-red-600">{errors.companySize.message}</p>}
                </div>
              </div>
              <InputField
                label="Website công ty"
                id="website"
                icon={<Globe size={16} className="text-gray-400" />}
                register={register('website')}
                error={errors.website}
                placeholder="https:://www.tencongty.com"
              />
            </fieldset>

            {/* --- 2. Thông tin Người liên hệ (HR) --- */}
            <fieldset className="space-y-4 rounded-lg border p-5">
              <legend className="-ml-1 px-2 text-lg font-semibold text-blue-700">
                <div className="flex items-center space-x-2">
                  <Users size={20} />
                  <span>Thông tin liên hệ (HR)</span>
                </div>
              </legend>
              <InputField
                label="Họ tên của bạn (Người liên hệ)"
                id="hrName"
                icon={<User size={16} className="text-gray-400" />}
                register={register('hrName')}
                error={errors.hrName}
                placeholder="VD: Nguyễn Văn A"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Email liên hệ"
                  id="hrEmail"
                  icon={<Mail size={16} className="text-gray-400" />}
                  register={register('hrEmail')}
                  error={errors.hrEmail}
                  placeholder="hr@tencongty.com"
                />
                <InputField
                  label="Số điện thoại"
                  id="hrPhone"
                  icon={<Phone size={16} className="text-gray-400" />}
                  register={register('hrPhone')}
                  error={errors.hrPhone}
                  placeholder="VD: 0987654321"
                />
              </div>
            </fieldset>

            {/* --- 3. Thông tin Tài khoản --- */}
            <fieldset className="space-y-4 rounded-lg border p-5">
              <legend className="-ml-1 px-2 text-lg font-semibold text-blue-700">
                <div className="flex items-center space-x-2">
                  <Lock size={20} />
                  <span>Thông tin tài khoản</span>
                </div>
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Mật khẩu"
                  id="password"
                  type="password"
                  icon={<Lock size={16} className="text-gray-400" />}
                  register={register('password')}
                  error={errors.password}
                  placeholder="Ít nhất 6 ký tự"
                />
                <InputField
                  label="Xác nhận mật khẩu"
                  id="confirmPassword"
                  type="password"
                  icon={<Lock size={16} className="text-gray-400" />}
                  register={register('confirmPassword')}
                  error={errors.confirmPassword}
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
            </fieldset>

            {/* --- Submit Button --- */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-xs rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg
                           transition-all duration-300 hover:bg-blue-700
                           disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất Đăng ký'}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:underline">
                Đăng nhập ngay
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerRegister;