import React, { useState } from 'react';
import { Download, Eye, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Cần cài: npm install uuid
import CVForm from '../../components/cv/CVForm'; // Sắp tạo File 2/6
import CVPreview from '../../components/cv/CVPreview'; // Sắp tạo File 3/6

// --- DỮ LIỆU "GIẢ" BAN ĐẦU (ĐỂ TEST) ---
const initialCvData = {
  // Thông tin cá nhân
  personal: {
    fullName: 'Minh Tuấn (Default)',
    avatar: 'https://ui-avatars.com/api/?name=Minh+Tuan&background=random',
    title: 'Frontend Developer',
    phone: '0987 654 321',
    email: 'minhtuan@email.com',
    address: 'Hà Nội, Việt Nam',
  },
  // Giới thiệu
  summary: 'Là một Frontend Developer có 2 năm kinh nghiệm, tôi đam mê xây dựng các giao diện người dùng "mượt" và "responsive". Chuyên về React, Tailwind CSS, và Framer Motion.',
  // Kinh nghiệm (Giờ có ID)
  experience: [
    { id: uuidv4(), title: 'Senior Frontend Developer', company: 'FPT Software', years: '2023 - Nay', desc: 'Phát triển và bảo trì các ứng dụng web phức tạp... (Click để sửa)' },
    { id: uuidv4(), title: 'Junior Developer', company: 'Viettel Solutions', years: '2021 - 2023', desc: 'Tham gia dự án Y tế, tối ưu hóa hiệu suất...' },
  ],
  // Học vấn (Giờ có ID)
  education: [
    { id: uuidv4(), degree: 'Kỹ sư Công nghệ Thông tin', school: 'Đại học Bách Khoa Hà Nội', years: '2017 - 2021' },
  ],
  // Kỹ năng (Giờ có ID)
  skills: [
    { id: uuidv4(), name: 'ReactJS' },
    { id: uuidv4(), name: 'Tailwind CSS' },
    { id: uuidv4(), name: 'Framer Motion' },
    { id: uuidv4(), name: '.NET (biết chút)' },
  ],
};
// ------------------------------------

const CVBuilder = () => {
  // --- "BỘ NÃO" LÀ ĐÂY ---
  const [cvData, setCvData] = useState(initialCvData);
  const isVip = true; // <-- BẠN HÃY THỬ ĐỔI SANG `false` ĐỂ TEST
  const [selectedTemplate, setSelectedTemplate] = useState(isVip ? 'vip' : 'simple');

  // --- LOGIC "SIÊU CẤP" (ĐÃ NÂNG CẤP) ---

  // 1. Sửa "Mục đơn" (Tên, SĐT, Giới thiệu)
  const handlePersonalChange = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };
  const handleSummaryChange = (value) => {
    setCvData(prev => ({ ...prev, summary: value }));
  };

  // 2. Sửa "Mục trong mảng" (VD: Sửa 1 kinh nghiệm)
  const handleChangeItem = (section, id, field, value) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // 3. Thêm "Mục mới" (VD: Thêm 1 kinh nghiệm)
  const handleAddItem = (section) => {
    let newItem;
    if (section === 'experience') {
      newItem = { id: uuidv4(), title: 'Chức danh mới', company: 'Công ty mới', years: 'Năm', desc: 'Mô tả...' };
    } else if (section === 'education') {
      newItem = { id: uuidv4(), degree: 'Bằng cấp mới', school: 'Trường mới', years: 'Năm' };
    } else if (section === 'skills') {
      newItem = { id: uuidv4(), name: 'Kỹ năng mới' };
    }
    
    if (newItem) {
      setCvData(prev => ({
        ...prev,
        [section]: [...prev[section], newItem],
      }));
    }
  };

  // 4. Xóa "Mục"
  const handleRemoveItem = (section, id) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id),
    }));
  };
  
  // 5. Tải Avatar
  const handleUploadAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePersonalChange('avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full">
      
      {/* CỘT 1: FORM (BÊN TRÁI) */}
      <div className="w-1/2 h-full overflow-y-auto bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Trình Tạo CV Của Bạn</h2>
        {/* "HỒI SINH" FILE 2/6 */}
        <CVForm 
          data={cvData} 
          onPersonalChange={handlePersonalChange}
          onSummaryChange={handleSummaryChange}
          onChangeItem={handleChangeItem}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onUploadAvatar={handleUploadAvatar}
        />
      </div>

      {/* CỘT 2: PREVIEW (BÊN PHẢI) */}
      <div className="w-1/2 h-full overflow-y-auto bg-gray-100 p-6">
        {/* Thanh công cụ "xịn" */}
        <div className="mb-4 flex space-x-2 rounded-lg bg-white p-2 shadow">
          {/* Nút chọn Mẫu Đơn giản */}
          <button 
            onClick={() => setSelectedTemplate('simple')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold 
              ${selectedTemplate === 'simple' 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-gray-600 hover:bg-gray-100'}`
            }
          >
            Mẫu Đơn giản
          </button>
          
          {/* Nút chọn Mẫu VIP */}
          <button
            onClick={() => isVip && setSelectedTemplate('vip')}
            disabled={!isVip}
            className={`relative flex-1 rounded-md px-3 py-2 text-sm font-semibold
              ${selectedTemplate === 'vip' 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                : (isVip ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 bg-gray-50 cursor-not-allowed')}
            `}
          >
            <span className="absolute -top-2 -right-2 transform rotate-12">
              <Sparkles size={20} className="text-yellow-400" fill="currentColor" />
            </span>
            Mẫu VIP
            {!isVip && "(Chỉ dành cho VIP)"}
          </button>

          <button className="rounded-md p-2 text-gray-600 hover:bg-gray-100"><Eye size={18} /></button>
          <button className="rounded-md bg-green-500 p-2 text-white hover:bg-green-600"><Download size={18} /></button>
        </div>

        {/* Nơi "Preview" CV */}
        <div className="mx-auto max-w-[210mm] overflow-hidden rounded-lg bg-white shadow-2xl">
          {/* "HỒI SINH" FILE 3/6 */}
          <CVPreview 
              data={cvData} 
              template={selectedTemplate} // Truyền mẫu đã chọn
            />
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
