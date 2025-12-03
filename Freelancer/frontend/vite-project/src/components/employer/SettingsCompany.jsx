import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Building, Globe, Hash, Users, Save, MapPin, Loader2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import profileService from '../../../services/profileService';
import api from '../../../services/api'; // <<< IMPORT API
import { useToast } from '../../context/ToastContext';

// Tái sử dụng component UI
const SectionCard = ({ title, children }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
    <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
    {children}
  </motion.div>
);

const InputField = ({ label, name, register, errors, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
      <input {...register(name)} {...props} className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${errors[name] ? 'border-red-500' : 'border-gray-300'}`} />
    </div>
    {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>}
  </div>
);

const companySchema = yup.object().shape({
  companyName: yup.string().required('Tên công ty là bắt buộc'),
  taxCode: yup.string().required('Mã số thuế là bắt buộc'),
  website: yup.string().url('URL website không hợp lệ (phải có http/https)'),
  address: yup.string().required('Địa chỉ là bắt buộc'),
});

const SettingsCompany = ({ profile, onRefresh }) => {
  const { addToast } = useToast();
  const emp = profile?.employer || {};
  
  const [logoPreview, setLogoPreview] = useState(emp.companyLogoUrl || 'https://placehold.co/100x100/f03c2e/ffffff?text=Logo');
  const [isUploading, setIsUploading] = useState(false); // Loading cho upload logo

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(companySchema),
  });

  // Load dữ liệu vào form
  useEffect(() => {
    if (profile?.employer) {
        const e = profile.employer;
        reset({
            companyName: e.companyName || '',
            taxCode: e.taxCode || '',
            companySize: e.companySize || '1-20',
            website: e.companyWebsite || '',
            address: e.address || '',
        });
        // Nếu API trả về url logo, ưu tiên hiển thị
        if(e.companyLogoUrl) setLogoPreview(e.companyLogoUrl);
    }
  }, [profile, reset]);

  // --- HÀM XỬ LÝ UPLOAD LOGO (ĐÃ FIX) ---
  const handleLogoUpload = async (e) => {
     const file = e.target.files[0];
     if (!file) return;

     setIsUploading(true);
     const formData = new FormData();
     formData.append('file', file); // Key 'file' khớp với IFormFile trong Controller

     try {
         // Gọi API Upload
         const res = await api.post('/upload/company-logo', formData, {
             headers: { 'Content-Type': 'multipart/form-data' }
         });
         
         // Lấy URL trả về từ server (Controller trả về { Url: "..." })
         const newLogoUrl = res.data.Url || res.data.url;
         
         // Cập nhật UI ngay lập tức
         setLogoPreview(newLogoUrl);
         addToast('Cập nhật Logo thành công!', 'success');
         
         // Gọi refresh để cập nhật lại dữ liệu toàn trang (nếu cần thiết để đồng bộ Header)
         if(onRefresh) onRefresh();

     } catch (error) {
         console.error("Lỗi upload logo:", error);
         addToast('Lỗi khi tải lên logo. Vui lòng thử lại.', 'error');
     } finally {
         setIsUploading(false);
     }
  };

  // Xử lý lưu thông tin text
  const onSubmit = async (data) => {
    try {
        const payload = {
            fullName: profile.fullName,
            companyName: data.companyName,
            companySize: data.companySize,
            companyWebsite: data.website,
            address: data.address,
        };

        await profileService.updateMyProfile(payload);
        addToast('Cập nhật thông tin công ty thành công!', 'success');
        onRefresh();
    } catch (error) {
        console.error(error);
        addToast('Cập nhật thất bại.', 'error');
    }
  };

  return (
    <SectionCard title="Hồ sơ Doanh nghiệp">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Logo Upload Section */}
        <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
           <div className="relative">
              <img 
                src={logoPreview} 
                alt="Logo" 
                className={`h-24 w-24 rounded-xl object-contain bg-white border border-gray-200 shadow-sm transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`} 
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <Loader2 className="animate-spin text-blue-600" size={24} />
                </div>
              )}
           </div>
           
           <div>
              <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm ${isUploading ? 'pointer-events-none opacity-70' : ''}`}>
                 <Upload size={16} /> {isUploading ? 'Đang tải lên...' : 'Thay đổi Logo'}
                 <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploading} />
              </label>
              <p className="text-xs text-gray-500 mt-2">Định dạng: PNG, JPG. Kích thước tối đa 2MB.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <InputField label="Tên công ty" name="companyName" register={register} errors={errors} icon={<Building size={18} />} />
           <InputField label="Mã số thuế" name="taxCode" register={register} errors={errors} icon={<Hash size={18} />} disabled={true} placeholder="Liên hệ Admin để sửa" />
           
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quy mô nhân sự</label>
              <div className="relative">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Users size={18} /></span>
                 <select {...register('companySize')} className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="1-20">1 - 20 nhân viên</option>
                    <option value="21-100">21 - 100 nhân viên</option>
                    <option value="101-500">101 - 500 nhân viên</option>
                    <option value="501+">Trên 500 nhân viên</option>
                 </select>
              </div>
           </div>

           <InputField label="Website" name="website" register={register} errors={errors} icon={<Globe size={18} />} />
        </div>

        <InputField label="Địa chỉ trụ sở" name="address" register={register} errors={errors} icon={<MapPin size={18} />} />
        
        <div className="flex justify-end pt-4 border-t border-gray-100">
           <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md disabled:opacity-50">
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>Lưu thông tin công ty</span>
           </button>
        </div>

      </form>
    </SectionCard>
  );
};

export default SettingsCompany;