// AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false); 

  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(prev => !prev);
  };
  const handleCloseMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };
  const handleToggleDesktopSidebar = () => {
    setIsDesktopSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar 
        isMobileOpen={isMobileSidebarOpen} 
        isDesktopCollapsed={isDesktopSidebarCollapsed}  // ✅ Đổi đúng tên prop
        onCloseSidebar={handleCloseMobileSidebar} 
      />

      <div className="flex flex-1 flex-col h-screen">
        <AdminHeader 
          onToggleMobileSidebar={handleToggleMobileSidebar}
          onToggleDesktopSidebar={handleToggleDesktopSidebar}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
