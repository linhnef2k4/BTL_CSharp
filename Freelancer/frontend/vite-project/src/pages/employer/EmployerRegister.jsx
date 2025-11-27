import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Building, Users, Hash, Globe, Loader2, MapPin } from 'lucide-react';
import profileService from '../../../services/profileService'; // Import service gọi API
import { useToast } from '../../context/ToastContext'; // Import để hiện thông báo góc phải

// --- Validation ---
// Lưu ý: Vì user đã đăng nhập (là Seeker), ta KHÔNG CẦN bắt nhập Email/Mật khẩu nữa.
// Chỉ cần nhập thông tin doanh nghiệp để nâng cấp.
const schema = yup.object().shape({
  companyName: yup.string().required('Tên công ty là bắt buộc'),
  taxCode: yup
    .string()
    .required('Mã số thuế là bắt buộc')
    .matches(/^[0-9]{10,13}$/, 'Mã số thuế phải từ 10-13 số'),
  companySize: yup.string().required('Vui lòng chọn quy mô'),
  website: yup.string().url('URL website không hợp lệ (cần có http/https)').required('Website là bắt buộc'),
  address: yup.string().required('Địa chỉ trụ sở là bắt buộc'),
});

// --- Component Input Helper ---
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

const EmployerRegister = () => {
  const navigate = useNavigate();
  const { addToast } = useToast(); // Hook thông báo
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // 1. Gọi API gửi yêu cầu nâng cấp
      await profileService.requestEmployer({
        companyName: data.companyName,
        taxCode: data.taxCode,
        companySize: data.companySize,
        companyWebsite: data.website,
        address: data.address
      });

      // 2. Thành công -> Hiện thông báo chạy vào góc phải
      addToast('Gửi yêu cầu thành công! Vui lòng chờ Admin duyệt.', 'success');
      
      // 3. Chuyển hướng về Trang Chủ (Thay vì Dashboard)
      navigate('/');

    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      // Lấy message lỗi từ Backend trả về (ví dụ: "Bạn đã gửi yêu cầu rồi")
      const errorMessage = error.response?.data || 'Đăng ký thất bại. Vui lòng thử lại.';
      addToast(errorMessage, 'error');
    }
  };

  return (
    <div className="py-16 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="rounded-xl bg-white p-8 shadow-xl md:p-12 border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900">Đăng ký Đối tác Tuyển dụng</h1>
            <p className="mt-2 text-gray-600">
              Nâng cấp tài khoản hiện tại của bạn để đăng tin và tìm kiếm ứng viên.
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* --- Thông tin Công ty --- */}
            <fieldset className="space-y-5 rounded-xl border border-blue-100 bg-blue-50/30 p-6">
              <legend className="px-3 text-lg font-bold text-blue-800 bg-white rounded-lg shadow-sm border border-blue-100 flex items-center gap-2">
                <Building size={20} /> Thông tin Doanh nghiệp
              </legend>
              
              <InputField
                label="Tên công ty"
                id="companyName"
                icon={<Building size={16} className="text-gray-400" />}
                register={register('companyName')}
                error={errors.companyName}
                placeholder="VD: Công ty Cổ phần Công Nghệ ABC"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Mã số thuế"
                  id="taxCode"
                  icon={<Hash size={16} className="text-gray-400" />}
                  register={register('taxCode')}
                  error={errors.taxCode}
                  placeholder="10-13 chữ số"
                />
                
                <div>
                  <label htmlFor="companySize" className="block text-sm font-semibold text-gray-700 mb-1">
                    Quy mô nhân sự
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
                placeholder="https://www.congty.com"
              />

              <InputField
                label="Địa chỉ trụ sở chính"
                id="address"
                icon={<MapPin size={16} className="text-gray-400" />}
                register={register('address')}
                error={errors.address}
                placeholder="VD: Tầng 5, Tòa nhà X, Quận Cầu Giấy, Hà Nội"
              />
            </fieldset>

            {/* --- Submit Button --- */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg 
                           transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 
                           disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Đang xử lý...
                  </>
                ) : (
                  'Gửi yêu cầu đăng ký'
                )}
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                Hệ thống sẽ xem xét yêu cầu của bạn trong vòng 24h. <br/>
                Bằng việc đăng ký, bạn đồng ý với các điều khoản dịch vụ dành cho nhà tuyển dụng.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerRegister;