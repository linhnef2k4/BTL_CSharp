import React, { useState } from 'react';
import { User, Building, Bell, CreditCard, AlertTriangle } from 'lucide-react';

// "Import" (Import) "trước" (pre-import) "3" (three) "cái" (the) "nội dung" (content) "tabs" (tabs) "chính" (main) "chúng ta" (we) "SẮP" (WILL) "LÀM" (BUILD)
import SettingsAccount from '../../components/employer/SettingsAccount'; // Sắp "tạo" (create) (File 2/5)
import SettingsCompany from '../../components/employer/SettingsCompany'; // Sắp "tạo" (create) (File 3/5)
import SettingsDangerZone from '../../components/employer/SettingsDangerZone'; // Sắp "tạo" (create) (File 4/5)

// "Data" (Data) "cho" (for) "các" (the) "nút" (buttons) "Tab" (Tab)
const TABS = [
  { id: 'account', label: 'Tài khoản', icon: <User size={18} /> },
  { id: 'company', label: 'Công ty', icon: <Building size={18} /> },
  { id: 'notifications', label: 'Thông báo', icon: <Bell size={18} /> },
  { id: 'billing', label: 'Thanh toán', icon: <CreditCard size={18} /> },
  { id: 'danger', label: 'Vùng Nguy Hiểm', icon: <AlertTriangle size={18} /> },
];

// "Component" (Component) "con" (child) "cho" (for) "cái" (the) "nút" (button) "Tab" (Tab) "cho" (to be) "nó" (it) "sạch" (clean)
const TabButton = ({ isActive, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2
                transition-all duration-200
                ${isActive
                  ? 'border-blue-600 text-blue-600' // Style "Active" (Active)
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800' // Style "Thường" (Normal)
                }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// "Hàm" (Function) "để" (to) "Vẽ" (Render) "đúng" (correct) "Nội dung" (Content) "Tab" (Tab)
const renderTabContent = (tabId) => {
  switch (tabId) {
    case 'account':
      return <SettingsAccount />; // "Gọi" (Call) "File 2/5" (File 2/5)
    case 'company':
      return <SettingsCompany />; // "Gọi" (Call) "File 3/5" (File 3/5)
    case 'danger':
      return <SettingsDangerZone />; // "Gọi" (Call) "File 4/5" (File 4/5)
    
    // "2" (Two) "cái" (the) "này" (these) "ít" (less) "quan trọng" (important) "hơn" (more), "ta" (we) "để" (use) "hàng" (content) "giả" (placeholder) "trước" (for now)
    case 'notifications':
      return <div className="rounded-xl bg-white p-6 shadow-lg"><h2 className="text-xl font-bold">Cài đặt Thông báo</h2><p>Chức năng này đang được phát triển...</p></div>;
    case 'billing':
      return <div className="rounded-xl bg-white p-6 shadow-lg"><h2 className="text-xl font-bold">Quản lý Thanh toán</h2><p>Chức năng này đang được phát triển...</p></div>;
    
    default:
      return <SettingsAccount />; // "Mặc định" (Default) "là" (is) "Tab" (Tab) "Tài khoản" (Account)
  }
};

// --- "TRANG" (PAGE) "CHÍNH" (MAIN) ---
const SettingsPage = () => {
  // "BỘ NÃO" (BRAIN) "LÀ" (IS) "ĐÂY" (HERE): "Quản lý" (Manages) "tab" (tab) "nào" (which) "đang" (is) "active" (active)
  const [activeTab, setActiveTab] = useState('account'); 

  return (
    <div className="space-y-6">
      
      {/* 1. "Tiêu đề" (Title) "trang" (page) */}
      <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
      
      {/* 2. "Thanh" (Bar) "Điều hướng" (Navigation) "TABS" (TABS) */}
      <div className="border-b border-gray-200 bg-white shadow-sm rounded-t-lg overflow-x-auto">
        <nav className="flex -mb-px space-x-2 px-4">
          {TABS.map(tab => (
            <TabButton 
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)} // "Click" (Click) "là" (is) "đổi" (change) "state" (state)
            />
          ))}
        </nav>
      </div>

      {/* 3. "Nội dung" (Content) "của" (of) "Tab" (Tab) "tương ứng" (corresponding) (Phần "thân" (body)) */}
      <div className="mt-4">
        {renderTabContent(activeTab)}
      </div>

    </div>
  );
};

export default SettingsPage;