import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, BarChart3, Clock, Brain, Award, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Component "Linh Kiện" UI (cho "sạch") ---
const InputField = ({ label, name, register, errors, icon }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        {icon}
      </span>
      <input
        {...register(name)}
        className={`w-full rounded-lg border py-2.5 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>}
    </div>
  </div>
);

const SelectField = ({ label, name, control, errors, icon, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        {icon}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className={`w-full appearance-none rounded-lg border py-2.5 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
          >
            {children}
          </select>
        )}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>}
    </div>
  </div>
);

const TextareaField = ({ label, name, register, errors, icon }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute top-3 left-0 flex items-center pl-3 text-gray-400">
        {icon}
      </span>
      <textarea
        {...register(name)}
        rows="5"
        className={`w-full rounded-lg border py-2.5 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
      ></textarea>
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>}
    </div>
  </div>
);
// ------------------------------------

// --- Validation "Siêu Chi Tiết" ---
const schema = yup.object().shape({
  jobTitle: yup.string().required('Chức danh là bắt buộc'),
  location: yup.string().required('Địa điểm là bắt buộc'),
  salaryMin: yup.number().typeError('Phải là số').min(0, 'Lương không thể âm').required('Lương tối thiểu là bắt buộc'),
  salaryMax: yup.number().typeError('Phải là số').min(yup.ref('salaryMin'), 'Lương tối đa phải lớn hơn tối thiểu').required('Lương tối đa là bắt buộc'),
  jobType: yup.string().oneOf(['Full-time', 'Part-time', 'Remote', 'Contract'], 'Loại công việc không hợp lệ').required('Vui lòng chọn loại công việc'),
  jobLevel: yup.string().oneOf(['Fresher', 'Junior', 'Senior', 'Lead', 'Manager'], 'Cấp bậc không hợp lệ').required('Vui lòng chọn cấp bậc'),
  jobDesc: yup.string().required('Mô tả công việc là bắt buộc').min(50, 'Mô tả phải ít nhất 50 ký tự'),
  jobRequirement: yup.string().required('Yêu cầu ứng viên là bắt buộc').min(50, 'Yêu cầu phải ít nhất 50 ký tự'),
  jobBenefit: yup.string().required('Quyền lợi là bắt buộc'),
  skills: yup.string().required('Kỹ năng là bắt buộc (VD: React, .NET, SQL)'),
});
// ---------------------------------

const PostJob = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      jobType: 'Full-time',
      jobLevel: 'Junior',
    }
  });

  const onSubmit = (data) => {
    console.log('Dữ liệu Job Mới:', data);
    // (Sau này bạn sẽ gọi API ở đây)
    // await api.post('/employer/jobs', data);
    
    // Giả lập thành công và chuyển về Dashboard
    navigate('/employer/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Đăng Tin Tuyển Dụng Mới</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl bg-white p-8 shadow-2xl">
        
        {/* KHU VỰC 1: THÔNG TIN CƠ BẢN */}
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Thông tin cơ bản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <InputField label="Chức danh tuyển dụng" name="jobTitle" register={register} errors={errors} icon={<Briefcase size={18} />} />
          <InputField label="Địa điểm làm việc (VD: Hà Nội, Remote)" name="location" register={register} errors={errors} icon={<MapPin size={18} />} />
          <InputField label="Lương tối thiểu (Triệu VNĐ)" name="salaryMin" type="number" register={register} errors={errors} icon={<DollarSign size={18} />} />
          <InputField label="Lương tối đa (Triệu VNĐ)" name="salaryMax" type="number" register={register} errors={errors} icon={<DollarSign size={18} />} />
          <SelectField label="Hình thức" name="jobType" control={control} errors={errors} icon={<Clock size={18} />}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote (Từ xa)</option>
            <option value="Contract">Contract</option>
          </SelectField>
          <SelectField label="Cấp bậc" name="jobLevel" control={control} errors={errors} icon={<BarChart3 size={18} />}>
            <option value="Fresher">Fresher</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead / Team Leader</option>
            <option value="Manager">Manager</option>
          </SelectField>
        </div>

        {/* KHU VỰC 2: CHI TIẾT (ĐẦY ĐỦ) */}
        <h2 className="text-xl font-semibold mt-8 mb-4 border-b pb-2">Chi tiết Job</h2>
        <TextareaField label="Mô tả công việc" name="jobDesc" register={register} errors={errors} icon={<Briefcase size={18} />} />
        <TextareaField label="Yêu cầu ứng viên" name="jobRequirement" register={register} errors={errors} icon={<Brain size={18} />} />
        <TextareaField label="Quyền lợi & Phúc lợi" name="jobBenefit" register={register} errors={errors} icon={<Award size={18} />} />
        
        <InputField 
          label="Các kỹ năng bắt buộc (Cách nhau bằng dấu phẩy)" 
          name="skills" 
          register={register} 
          errors={errors} 
          icon={<Brain size={18} />} 
          placeholder="VD: React, Node.js, SQL"
        />

        {/* NÚT SUBMIT */}
        <div className="mt-8 text-right">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-lg
                       transition-all duration-300 hover:bg-blue-700
                       disabled:cursor-not-allowed disabled:bg-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={18} />
            {isSubmitting ? 'Đang xử lý...' : 'Đăng tuyển ngay'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default PostJob;