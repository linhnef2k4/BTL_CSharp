import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// "Import" (Import) "icon" (icons) "MỚI" (NEW) "cho" (for) "form" (form) "này" (this)
import { Building, Globe, Hash, Users, FileText, Save, Upload } from 'lucide-react'; 
import { motion } from 'framer-motion';

// --- "Linh kiện" (Component) "con" (child) (Copy "từ" (from) "File 2/5") ---
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

// 3. "Textarea" (Textarea) "Xịn" (Pro)
const TextareaField = ({ label, name, register, errors, icon, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute top-3 left-0 flex items-center pl-3 text-gray-400">
        {icon}
      </span>
      <textarea
        {...register(name)}
        rows="5"
        {...props}
        className={`w-full rounded-lg border py-2.5 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
      ></textarea>
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>}
    </div>
  </div>
);
// ------------------------------------

// --- "Logic" (Logic) "Validate" (Validation) "CHO" (FOR) "FORM" (FORM) "CÔNG TY" (COMPANY) ---
const companySchema = yup.object().shape({
  companyName: yup.string().required('Tên công ty là bắt buộc'),
  taxCode: yup.string().matches(/^[0-9]{10}$/, 'Mã số thuế phải là 10 chữ số'), // "Không" (Not) "bắt buộc" (required) "ở" (at) "đây" (here)
  website: yup.string().url('URL website không hợp lệ'),
  companySize: yup.string(),
  description: yup.string().max(1000, 'Mô tả không quá 1000 ký tự'),
});
// ---------------------------------

const SettingsCompany = () => {
  // "Logo" (Logo) "tạm" (temp)
  const [logoPreview, setLogoPreview] = useState('https://placehold.co/100x100/f03c2e/ffffff?text=F');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(companySchema),
    // "Load" (Load) "data" (data) "giả" (mock) (sau "này" (later) "lấy" (get) "từ" (from) "API" (API))
    defaultValues: {
      companyName: 'FPT Software',
      taxCode: '0101010101',
      companySize: '501+',
      website: 'https://fptsoftware.com',
      description: 'Là công ty hàng đầu về công nghệ thông tin tại Việt Nam...'
    }
  });

  // "Hàm" (Function) "Submit" (Submit) "cho" (for) "Form" (Form) "này" (this)
  const onCompanySubmit = (data) => {
    console.log('Cập nhật Thông tin Công ty:', data);
    // (Gọi (Call) API "cập nhật" (update) "info" (info) "công ty" (company) "ở" (at) "đây" (here))
  };
  
  // "Hàm" (Function) "xử lý" (handle) "tải" (upload) "logo" (logo)
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result); // "Hiển thị" (Show) "ảnh" (image) "mới" (new) "ngay" (immediately)
      };
      reader.readAsDataURL(file);
      // (Sau "này" (later) "bạn" (you) "sẽ" (will) "gọi" (call) "API" (API) "upload" (upload) "ảnh" (image) "ở" (at) "đây" (here))
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CARD 1: THÔNG TIN CÔNG TY */}
      <SectionCard title="Thông tin Công ty">
        <form onSubmit={handleSubmit(onCompanySubmit)} className="space-y-4">
          
          {/* Tải Logo */}
          <div className="flex items-center gap-4">
            <img src={logoPreview} alt="Logo" className="h-20 w-20 rounded-lg object-contain border" />
            <div>
              <label 
                htmlFor="logoUpload" 
                className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700
                           hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Upload size={16} />
                  <span>Đổi Logo</span>
                </div>
                <input type="file" id="logoUpload" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
              </label>
              <p className="text-xs text-gray-500 mt-2">Nên là ảnh vuông, PNG hoặc JPG.</p>
            </div>
          </div>
          
          <hr className="my-4"/>

          {/* Các "Input" (Inputs) "khác" (other) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField label="Tên công ty" name="companyName" register={register} errors={errors} icon={<Building size={18} />} />
            <InputField label="Website" name="website" register={register} errors={errors} icon={<Globe size={18} />} />
            <InputField label="Mã số thuế" name="taxCode" register={register} errors={errors} icon={<Hash size={18} />} />
            {/* "Select" (Select) "cho" (for) "Quy mô" (Size) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quy mô công ty</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Users size={18} /></span>
                <select
                  {...register('companySize')}
                  className={`w-full rounded-lg border py-2.5 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.companySize ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="1-20">1 - 20 nhân viên</option>
                  <option value="21-100">21 - 100 nhân viên</option>
                  <option value="101-500">101 - 500 nhân viên</option>
                  <option value="501+">Trên 500 nhân viên</option>
                </select>
              </div>
            </div>
          </div>

          {/* "Mô tả" (Description) */}
          <TextareaField 
            label="Mô tả công ty" 
            name="description" 
            register={register} 
            errors={errors} 
            icon={<FileText size={18} />}
            placeholder="Giới thiệu về công ty của bạn..."
          />
          
          {/* Nút "Lưu" (Save) */}
          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 
                         font-semibold text-white shadow-lg transition-all 
                         hover:scale-105 hover:bg-blue-700 
                         disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};

export default SettingsCompany;