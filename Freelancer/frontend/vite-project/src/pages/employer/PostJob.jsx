import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, BarChart3, Clock, Brain, Award, Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import projectService from '../../../services/projectService'; // Import service
import { useToast } from '../../context/ToastContext'; // Import Toast

// --- Component "Linh Kiện" UI ---
const InputField = ({ label, name, register, errors, icon, type = "text", placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
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

// --- Validation Schema (Khớp với DTO) ---
const schema = yup.object().shape({
  title: yup.string().required('Chức danh là bắt buộc').max(100, 'Tối đa 100 ký tự'),
  location: yup.string().required('Địa điểm là bắt buộc'),
  minSalary: yup.number().typeError('Phải là số').min(0, 'Lương không thể âm').required('Lương tối thiểu là bắt buộc'),
  maxSalary: yup.number().typeError('Phải là số').min(yup.ref('minSalary'), 'Lương tối đa phải lớn hơn tối thiểu').required('Lương tối đa là bắt buộc'),
  workType: yup.string().oneOf(['Full-time', 'Part-time', 'Remote', 'Contract'], 'Loại công việc không hợp lệ').required('Vui lòng chọn loại công việc'),
  level: yup.string().oneOf(['Fresher', 'Junior', 'Senior', 'Lead', 'Manager'], 'Cấp bậc không hợp lệ').required('Vui lòng chọn cấp bậc'),
  description: yup.string().required('Mô tả công việc là bắt buộc').min(50, 'Mô tả phải ít nhất 50 ký tự'),
  requirements: yup.string().required('Yêu cầu ứng viên là bắt buộc').min(50, 'Yêu cầu phải ít nhất 50 ký tự'),
  benefits: yup.string().required('Quyền lợi là bắt buộc'),
  skills: yup.string().required('Kỹ năng là bắt buộc'), // Trường này sẽ được gộp vào requirements khi gửi
});

const PostJob = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      workType: 'Full-time',
      level: 'Junior',
    }
  });

  const onSubmit = async (data) => {
    try {
      // Chuẩn bị payload gửi lên Server
      // Vì DTO Backend không có trường "Skills", ta nối nó vào Requirements để không mất dữ liệu
      const payload = {
        title: data.title,
        description: data.description,
        requirements: `${data.requirements}\n\nKỹ năng yêu cầu:\n${data.skills}`, // Gộp skills vào đây
        benefits: data.benefits,
        location: data.location,
        minSalary: data.minSalary,
        maxSalary: data.maxSalary,
        workType: data.workType,
        level: data.level
      };

      // Gọi API
      await projectService.createProject(payload);

      addToast('Đăng tin thành công! Vui lòng chờ Admin duyệt.', 'success');
      navigate('/employer/dashboard');
      
    } catch (error) {
      console.error("Lỗi đăng tin:", error);
      // Xử lý lỗi logic từ Backend (VD: Hết lượt đăng tin)
      const msg = error.response?.data || 'Có lỗi xảy ra khi đăng tin.';
      addToast(msg, 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Đăng Tin Tuyển Dụng Mới</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        
        {/* KHU VỰC 1: THÔNG TIN CƠ BẢN */}
        <h2 className="text-xl font-bold text-blue-700 mb-5 border-b pb-2 flex items-center gap-2">
           <Briefcase size={20}/> Thông tin cơ bản
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <InputField label="Chức danh tuyển dụng" name="title" register={register} errors={errors} icon={<Briefcase size={18} />} placeholder="VD: Senior React Developer" />
          <InputField label="Địa điểm làm việc" name="location" register={register} errors={errors} icon={<MapPin size={18} />} placeholder="VD: Hà Nội (hoặc Remote)" />
          
          <InputField label="Lương tối thiểu (VNĐ)" name="minSalary" type="number" register={register} errors={errors} icon={<DollarSign size={18} />} />
          <InputField label="Lương tối đa (VNĐ)" name="maxSalary" type="number" register={register} errors={errors} icon={<DollarSign size={18} />} />
          
          <SelectField label="Hình thức" name="workType" control={control} errors={errors} icon={<Clock size={18} />}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote (Từ xa)</option>
            <option value="Contract">Contract</option>
          </SelectField>
          
          <SelectField label="Cấp bậc" name="level" control={control} errors={errors} icon={<BarChart3 size={18} />}>
            <option value="Fresher">Fresher</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead / Team Leader</option>
            <option value="Manager">Manager</option>
          </SelectField>
        </div>

        {/* KHU VỰC 2: CHI TIẾT */}
        <h2 className="text-xl font-bold text-blue-700 mt-8 mb-5 border-b pb-2 flex items-center gap-2">
            <FileText size={20} /> Chi tiết công việc
        </h2>

        <TextareaField label="Mô tả công việc" name="description" register={register} errors={errors} icon={<Briefcase size={18} />} />
        <TextareaField label="Yêu cầu ứng viên" name="requirements" register={register} errors={errors} icon={<Brain size={18} />} />
        <TextareaField label="Quyền lợi & Phúc lợi" name="benefits" register={register} errors={errors} icon={<Award size={18} />} />
        
        <InputField 
          label="Các kỹ năng bắt buộc (Sẽ gộp vào yêu cầu)" 
          name="skills" 
          register={register} 
          errors={errors} 
          icon={<Brain size={18} />} 
          placeholder="VD: React, Node.js, SQL (Cách nhau bởi dấu phẩy)"
        />

        {/* NÚT SUBMIT */}
        <div className="mt-8 flex justify-end">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg
                       transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1
                       disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:translate-y-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {isSubmitting ? 'Đang đăng tin...' : 'Đăng tuyển ngay'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

// Icon phụ cho tiêu đề
import { FileText } from 'lucide-react';

export default PostJob;