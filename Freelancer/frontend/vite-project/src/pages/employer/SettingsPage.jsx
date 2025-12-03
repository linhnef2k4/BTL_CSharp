import React, { useState, useEffect } from 'react';
import { User, Building, Bell, CreditCard, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import profileService from '../../../services/profileService';

// Components
import SettingsAccount from '../../components/employer/SettingsAccount';
import SettingsCompany from '../../components/employer/SettingsCompany';
import SettingsDangerZone from '../../components/employer/SettingsDangerZone'; // Đã import và kích hoạt

const TABS = [
  { id: 'account', label: 'Tài khoản', icon: <User size={18} /> },
  { id: 'company', label: 'Công ty', icon: <Building size={18} /> },
  { id: 'notifications', label: 'Thông báo', icon: <Bell size={18} /> },
  { id: 'billing', label: 'Thanh toán', icon: <CreditCard size={18} /> },
  { id: 'danger', label: 'Vùng Nguy Hiểm', icon: <AlertTriangle size={18} /> }, // Tab này đã được mở
];

const TabButton = ({ isActive, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap
      ${isActive ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
  >
    {icon} <span>{label}</span>
  </button>
);

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // 1. Fetch toàn bộ thông tin Profile khi vào trang
  const fetchProfile = async () => {
    try {
      const res = await profileService.getMyProfile();
      setProfileData(res.data);
    } catch (error) {
      console.error("Lỗi tải profile:", error);
      addToast("Không thể tải thông tin cài đặt.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Hàm callback để reload lại data sau khi update thành công ở component con
  const handleRefresh = () => {
      fetchProfile();
  };

  const renderTabContent = () => {
    if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div>;
    if (!profileData) return <div className="text-center py-10 text-gray-500">Lỗi tải dữ liệu.</div>;

    switch (activeTab) {
      case 'account':
        return <SettingsAccount profile={profileData} onRefresh={handleRefresh} />;
      case 'company':
        return <SettingsCompany profile={profileData} onRefresh={handleRefresh} />;
      case 'notifications':
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Cài đặt thông báo</h3>
                <p className="text-gray-500 mt-1">Tính năng này đang được phát triển. Bạn sẽ sớm có thể tùy chỉnh thông báo qua Email và Hệ thống.</p>
            </div>
        );
      case 'billing':
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <CreditCard className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Lịch sử thanh toán</h3>
                <p className="text-gray-500 mt-1">Tính năng xem lịch sử giao dịch và quản lý thẻ đang được phát triển.</p>
            </div>
        );
      case 'danger': 
        return <SettingsDangerZone />; // Tab Vùng Nguy Hiểm
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 bg-white shadow-sm rounded-t-xl overflow-x-auto">
        <nav className="flex">
          {TABS.map(tab => (
            <TabButton 
              key={tab.id} 
              {...tab} 
              isActive={activeTab === tab.id} 
              onClick={() => setActiveTab(tab.id)} 
            />
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SettingsPage;