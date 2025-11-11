import React from 'react';
import { Plus, Trash2, ChevronDown, Upload, XCircle } from 'lucide-react'; // <-- ĐÃ IMPORT XCircle

// --- Component con "xịn" ---

// Input "nhãn" (label) nổi
const InputField = ({ label, value, onChange, ...props }) => (
  <div className="relative">
    <input
      value={value}
      onChange={onChange}
      {...props}
      placeholder=" " /* <-- Trick "thần thánh" để label hoạt động */
      className="w-full rounded-md border-gray-300 py-2 px-3 text-sm shadow-sm peer focus:border-blue-500 focus:ring-blue-500"
    />
    <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-400
                     peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm
                     transition-all duration-200
                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600">
      {label}
    </label>
  </div>
);

// Textarea (giống InputField)
const TextareaField = ({ label, value, onChange, ...props }) => (
  <div className="relative">
    <textarea
      value={value}
      onChange={onChange}
      {...props}
      placeholder=" " /* <-- Trick "thần thánh" */
      className="w-full rounded-md border-gray-300 py-2 px-3 text-sm shadow-sm peer focus:border-blue-500 focus:ring-blue-500"
      rows={4}
    />
    <label className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-400
                     peer-placeholder-shown:top-2 peer-placeholder-shown:text-base
                     transition-all duration-200
                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600">
      {label}
    </label>
  </div>
);

// Bộ 3 nút "Thêm", "Xóa", "Sửa"
const FormSection = ({ title, onAddItem, children }) => (
  <details className="group rounded-lg border bg-white shadow-sm" open>
    <summary className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="flex items-center space-x-2">
        {onAddItem && (
          <button
            type="button"
            onClick={onAddItem}
            className="rounded-full p-1.5 text-blue-600 hover:bg-blue-100"
            title={`Thêm ${title}`}
          >
            <Plus size={18} />
          </button>
        )}
        <ChevronDown size={20} className="text-gray-500 group-open:rotate-180 transition-transform" />
      </div>
    </summary>
    <div className="space-y-4 p-4 border-t">
      {children}
    </div>
  </details>
);

// --- Component Form Chính ---

const CVForm = ({ 
  data, 
  onPersonalChange, 
  onSummaryChange, 
  onChangeItem, 
  onAddItem, 
  onRemoveItem,
  onUploadAvatar 
}) => {
  const { personal, summary, experience, education, skills } = data;

  return (
    <form className="space-y-6">
      
      {/* 1. Thông tin cá nhân */}
      <FormSection title="Thông tin cá nhân">
        <div className="w-24 h-24 rounded-full relative group">
          <img src={personal.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover"/>
          <label 
            htmlFor="avatarUpload" 
            className="absolute inset-0 flex items-center justify-center bg-black/50 
                       rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Upload size={24} className="text-white" />
            <input type="file" id="avatarUpload" accept="image/*" className="hidden" onChange={onUploadAvatar}/>
          </label>
        </div>
        <InputField label="Họ và Tên" value={personal.fullName} onChange={(e) => onPersonalChange('fullName', e.target.value)} />
        <InputField label="Chức danh" value={personal.title} onChange={(e) => onPersonalChange('title', e.target.value)} />
        <InputField label="Số điện thoại" value={personal.phone} onChange={(e) => onPersonalChange('phone', e.target.value)} />
        <InputField label="Email" type="email" value={personal.email} onChange={(e) => onPersonalChange('email', e.target.value)} />
        <InputField label="Địa chỉ" value={personal.address} onChange={(e) => onPersonalChange('address', e.target.value)} />
      </FormSection>

      {/* 2. Giới thiệu (Summary) */}
      <FormSection title="Giới thiệu bản thân">
        <TextareaField 
          label="Giới thiệu..." 
          value={summary} 
          onChange={(e) => onSummaryChange(e.target.value)} 
          placeholder="Mô tả kinh nghiệm, đam mê..."
        />
      </FormSection>

      {/* 3. Kinh nghiệm (Logic Sửa/Thêm/Xóa) */}
      <FormSection title="Kinh nghiệm" onAddItem={() => onAddItem('experience')}>
        {experience.map((exp, index) => (
          <div key={exp.id} className="space-y-3 rounded-md border p-3 relative">
            <h4 className="font-medium">Mục {index + 1}</h4>
            <InputField label="Chức danh" value={exp.title} onChange={(e) => onChangeItem('experience', exp.id, 'title', e.target.value)} />
            <InputField label="Công ty" value={exp.company} onChange={(e) => onChangeItem('experience', exp.id, 'company', e.target.value)} />
            <InputField label="Thời gian (VD: 2023 - Nay)" value={exp.years} onChange={(e) => onChangeItem('experience', exp.id, 'years', e.target.value)} />
            <TextareaField label="Mô tả công việc" value={exp.desc} onChange={(e) => onChangeItem('experience', exp.id, 'desc', e.target.value)} />
            <button 
              type="button" 
              onClick={() => onRemoveItem('experience', exp.id)}
              className="absolute -top-3 -right-3 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </FormSection>

      {/* 4. Học vấn (Logic Sửa/Thêm/Xóa) */}
      <FormSection title="Học vấn" onAddItem={() => onAddItem('education')}>
        {education.map((edu, index) => (
          <div key={edu.id} className="space-y-3 rounded-md border p-3 relative">
            <h4 className="font-medium">Mục {index + 1}</h4>
            <InputField label="Bằng cấp / Chuyên ngành" value={edu.degree} onChange={(e) => onChangeItem('education', edu.id, 'degree', e.target.value)} />
            <InputField label="Trường học" value={edu.school} onChange={(e) => onChangeItem('education', edu.id, 'school', e.target.value)} />
            <InputField label="Thời gian (VD: 2017 - 2021)" value={edu.years} onChange={(e) => onChangeItem('education', edu.id, 'years', e.target.value)} />
            <button 
              type="button" 
              onClick={() => onRemoveItem('education', edu.id)}
              className="absolute -top-3 -right-3 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </FormSection>

      {/* 5. Kỹ năng (Logic Sửa/Thêm/Xóa) */}
      <FormSection title="Kỹ năng" onAddItem={() => onAddItem('skills')}>
        <div className="grid grid-cols-2 gap-3">
          {skills.map((skill) => (
            <div key={skill.id} className="relative">
              <InputField label="Tên kỹ năng" value={skill.name} onChange={(e) => onChangeItem('skills', skill.id, 'name', e.target.value)} />
              <button 
                type="button" 
                onClick={() => onRemoveItem('skills', skill.id)}
                className="absolute top-2 right-1 p-0.5 text-gray-400 hover:text-red-500"
              >
                <XCircle size={16} />
              </button>
            </div>
          ))}
        </div>
      </FormSection>

    </form>
  );
};

export default CVForm;