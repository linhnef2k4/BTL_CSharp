import React, { useState, useRef, useEffect } from 'react';
import { Download, Eye, Sparkles, Loader2 } from 'lucide-react'; // Thêm Loader2 để làm hiệu ứng loading
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas'; // Import thư viện chụp ảnh
import jsPDF from 'jspdf'; // Import thư viện tạo PDF

// Import các component con
import CVForm from '../../components/cv/CVForm';
import CVPreview from '../../components/cv/CVPreview';

// Import Auth Context
import { useAuth } from '../../context/AuthContext'; // Đường dẫn tuỳ folder của bạn

// --- DỮ LIỆU MẶC ĐỊNH (Fallback) ---
const defaultCvData = {
  personal: {
    fullName: 'Tên của bạn',
    avatar: '',
    title: 'Vị trí ứng tuyển',
    phone: '',
    email: '',
    address: '',
  },
  summary: 'Mô tả ngắn gọn về bản thân...',
  experience: [],
  education: [],
  skills: [],
};

const CVBuilder = () => {
  // 1. Lấy thông tin User từ Context
  const { user } = useAuth();
  
  // Lấy trạng thái VIP an toàn (dùng optional chaining ?. để tránh lỗi nếu user null)
  // Cấu trúc API: user -> seeker -> isVip
  const isVip = user?.seeker?.isVip || false; 

  // 2. State dữ liệu CV
  const [cvData, setCvData] = useState(defaultCvData);
  const [selectedTemplate, setSelectedTemplate] = useState('simple'); // Mặc định là simple
  const [isDownloading, setIsDownloading] = useState(false); // State loading khi tải

  // 3. Ref để tham chiếu đến vùng Preview cần in
  const cvPreviewRef = useRef(null);

  // --- EFFECT: TỰ ĐỘNG ĐIỀN THÔNG TIN TỪ USER (Bonus) ---
  useEffect(() => {
    if (user) {
      setCvData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          // Ưu tiên lấy từ API, nếu không có thì giữ nguyên hoặc để trống
          fullName: user.fullName || prev.personal.fullName,
          email: user.email || prev.personal.email,
          phone: user.phoneNumber || prev.personal.phone,
          // Lấy avatar từ seeker object
          avatar: user.seeker?.avatar || prev.personal.avatar,
          title: user.seeker?.headline || prev.personal.title,
        }
      }));
    }
  }, [user]); // Chạy lại khi user thay đổi (lúc login xong)

  // --- LOGIC DOWNLOAD PDF (QUAN TRỌNG) ---
  const handleDownloadPDF = async () => {
    const element = cvPreviewRef.current;
    if (!element) return;

    setIsDownloading(true); // Bật loading

    try {
      // 1. Chụp ảnh phần Preview (tăng scale lên 2 để nét hơn)
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      // 2. Tạo file PDF khổ A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 3. Tính toán tỷ lệ để ảnh vừa khít trang A4
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // 4. Thêm ảnh vào PDF
      // Nếu CV dài hơn 1 trang A4, logic này sẽ in thu nhỏ vừa 1 trang (cơ bản).
      // Nếu muốn cắt trang phức tạp hơn thì cần logic nâng cao.
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);

      // 5. Lưu file
      pdf.save(`CV_${user?.fullName || 'MyCV'}.pdf`);

    } catch (error) {
      console.error("Lỗi khi tải CV:", error);
      alert("Không thể tải xuống. Vui lòng thử lại!");
    } finally {
      setIsDownloading(false); // Tắt loading
    }
  };

  // --- CÁC HÀM XỬ LÝ LOGIC CŨ (GIỮ NGUYÊN) ---
  const handlePersonalChange = (field, value) => {
    setCvData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };
  const handleSummaryChange = (value) => setCvData(prev => ({ ...prev, summary: value }));
  
  const handleChangeItem = (section, id, field, value) => {
    setCvData(prev => ({
      ...prev, [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item),
    }));
  };

  const handleAddItem = (section) => {
    let newItem;
    if (section === 'experience') newItem = { id: uuidv4(), title: 'Chức danh', company: 'Công ty', years: '2023', desc: 'Mô tả...' };
    else if (section === 'education') newItem = { id: uuidv4(), degree: 'Bằng cấp', school: 'Trường', years: '2020' };
    else if (section === 'skills') newItem = { id: uuidv4(), name: 'Kỹ năng mới' };
    
    if (newItem) setCvData(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const handleRemoveItem = (section, id) => {
    setCvData(prev => ({ ...prev, [section]: prev[section].filter(item => item.id !== id) }));
  };

  const handleUploadAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handlePersonalChange('avatar', reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full">
      
      {/* CỘT 1: FORM */}
      <div className="w-1/2 h-full overflow-y-auto bg-white p-6 shadow-lg scrollbar-thin">
        <h2 className="text-2xl font-bold mb-4">Trình Tạo CV: {user?.fullName}</h2>
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

      {/* CỘT 2: PREVIEW */}
      <div className="w-1/2 h-full overflow-y-auto bg-gray-100 p-6">
        {/* Toolbar */}
        <div className="mb-4 flex space-x-2 rounded-lg bg-white p-2 shadow sticky top-0 z-10">
          {/* Nút Simple */}
          <button 
            onClick={() => setSelectedTemplate('simple')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all
              ${selectedTemplate === 'simple' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}
            `}
          >
            Mẫu Đơn giản
          </button>
          
          {/* Nút VIP (Đã gắn logic check isVip) */}
          <button
            onClick={() => isVip && setSelectedTemplate('vip')}
            disabled={!isVip}
            className={`relative flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all
              ${selectedTemplate === 'vip' 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                : (isVip ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 bg-gray-50 cursor-not-allowed opacity-70')}
            `}
          >
            <div className="flex items-center justify-center space-x-1">
              {!isVip && <span className="absolute -top-2 -right-2 transform rotate-12">
                <Sparkles size={20} className="text-gray-400" />
              </span>}
              {isVip && <Sparkles size={16} className={selectedTemplate === 'vip' ? 'text-white' : 'text-yellow-500'} />}
              <span>Mẫu VIP {!isVip && "(Khóa)"}</span>
            </div>
          </button>

          {/* Nút Download */}
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center space-x-1 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-green-300"
          >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            <span>{isDownloading ? 'Đang tạo...' : 'Tải'}</span>
          </button>
        </div>

        {/* Vùng Preview (Được bọc bởi Ref để chụp ảnh) */}
        <div className="flex justify-center">
            {/* Quan trọng: Ref phải đặt ở thẻ bao ngoài cùng của vùng muốn in 
               Dùng fit-content hoặc kích thước cố định để tránh in khoảng trắng thừa
            */}
            <div ref={cvPreviewRef} className="w-[210mm] bg-white shadow-2xl min-h-[297mm]"> 
              <CVPreview 
                data={cvData} 
                template={selectedTemplate} 
              />
            </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;