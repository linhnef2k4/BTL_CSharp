import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Brain, ShieldAlert, Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // "Dùng" (Use) "lại" (again) "thư viện" (library) "uuid" (uuid) "để" (to) "tạo" (create) "ID" (ID) "mới" (new)

// --- "Linh kiện" (Component) "con" (child) "cho" (for) "Tabs" (Tabs) ---
// 1. "Nút" (Button) "Tab" (Tab) (Giống "hệt" (exactly like) "SettingsPage" (SettingsPage))
const TabButton = ({ isActive, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2
                transition-all duration-200
                ${isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800'
                }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// 2. "Card" (Card) "Bọc" (Wrapper) "Nội dung" (Content) "Tab" (Tab)
const TabContentCard = ({ title, children }) => (
  <motion.div
    className="rounded-xl bg-white p-6 shadow-lg"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">{title}</h2>
    {children}
  </motion.div>
);
// ------------------------------------

// --- "Linh kiện" (Component) "cho" (for) "TAB 1: QUẢN LÝ DANH MỤC" (CATEGORY MANAGEMENT) ---
const CategoryManagement = () => {
  // "Data" (Data) "giả" (mock) "ban đầu" (initial)
  const [categories, setCategories] = useState([
    { id: uuidv4(), name: 'IT - Phần mềm' },
    { id: uuidv4(), name: 'Kế toán / Kiểm toán' },
    { id: uuidv4(), name: 'Marketing / Truyền thông' },
    { id: uuidv4(), name: 'Thiết kế / Sáng tạo' },
  ]);
  
  // "State" (State) "cho" (for) "form" (form) "Thêm/Sửa" (Add/Edit)
  const [editId, setEditId] = useState(null); // "Lưu" (Store) "ID" (ID) "của" (of) "thằng" (guy) "đang" (being) "sửa" (edited)
  const [currentName, setCurrentName] = useState(''); // "Lưu" (Store) "tên" (name) "đang" (being) "gõ" (typed)

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "bấm" (click) "nút" (button) "Lưu" (Save) (cho "cả" (both) "Thêm" (Add) "lẫn" (and) "Sửa" (Edit))
  const handleSave = () => {
    if (!currentName.trim()) return; // "Không" (Don't) "lưu" (save) "nếu" (if) "rỗng" (empty)

    if (editId) {
      // "Logic" (Logic) "SỬA" (EDIT)
      setCategories(prev => 
        prev.map(cat => (cat.id === editId ? { ...cat, name: currentName } : cat))
      );
    } else {
      // "Logic" (Logic) "THÊM MỚI" (ADD NEW)
      setCategories(prev => [...prev, { id: uuidv4(), name: currentName }]);
    }
    
    // "Reset" (Reset) "form" (form)
    setEditId(null);
    setCurrentName('');
  };

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "bấm" (click) "nút" (button) "Sửa" (Edit) (trên "1" (one) "cái" (a) "item" (item))
  const handleEdit = (category) => {
    setEditId(category.id);
    setCurrentName(category.name);
  };
  
  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "bấm" (click) "nút" (button) "Xóa" (Delete)
  const handleDelete = (id) => {
    // (Sau "này" (later) "thêm" (add) "modal" (modal) "xác nhận" (confirm) "ở" (at) "đây" (here) "cho" (to be) "nó" (it) "an toàn" (safe))
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "bấm" (click) "nút" (button) "Hủy" (Cancel)
  const handleCancel = () => {
    setEditId(null);
    setCurrentName('');
  };

  return (
    <TabContentCard title="Quản lý Danh mục Nghề nghiệp">
      {/* "Form" (Form) "Thêm/Sửa" (Add/Edit) "nằm" (sit) "cố định" (fixed) "ở" (at) "trên" (top) */}
      <div className="flex space-x-2 mb-4">
        <input 
          type="text"
          value={currentName}
          onChange={(e) => setCurrentName(e.target.value)}
          placeholder={editId ? 'Đang sửa tên...' : 'Nhập tên danh mục mới...'}
          className="flex-1 rounded-lg border-gray-300 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 
                     font-semibold text-white shadow-lg transition-all 
                     hover:scale-105 hover:bg-blue-700"
        >
          <Save size={18} />
          {editId ? 'Lưu' : 'Thêm'}
        </button>
        {/* "Nếu" (If) "đang" (is) "sửa" (editing), "hiện" (show) "thêm" (also) "nút" (button) "Hủy" (Cancel) */}
        {editId && (
          <button
            onClick={handleCancel}
            className="rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800
                       hover:bg-gray-300"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* "Danh sách" (List) "các" (the) "Danh mục" (Categories) "hiện có" (current) */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {categories.map(cat => (
          <div 
            key={cat.id} 
            className="flex items-center justify-between rounded-lg bg-gray-50 p-3 border"
          >
            <span className="font-medium text-gray-700">{cat.name}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(cat)}
                className="rounded-full p-1.5 text-blue-600 hover:bg-blue-100"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="rounded-full p-1.5 text-red-600 hover:bg-red-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </TabContentCard>
  );
};
// ------------------------------------

// "Hàm" (Function) "để" (to) "Vẽ" (Render) "đúng" (correct) "Nội dung" (Content) "Tab" (Tab)
const renderTabContent = (tabId) => {
  switch (tabId) {
    case 'categories':
      return <CategoryManagement />; // "Gọi" (Call) "linh kiện" (component) "xịn" (pro) "ở" (at) "trên" (above)
    
    // "2" (Two) "cái" (the) "này" (these) "để" (use) "hàng" (content) "giả" (placeholder) "trước" (for now)
    case 'skills':
      return <TabContentCard title="Quản lý Kỹ năng (Tags)"><p>Chức năng này đang được phát triển...</p></TabContentCard>;
    case 'blacklist':
      return <TabContentCard title="Quản lý Từ khóa Cấm (Blacklist)"><p>Chức năng này đang được phát triển...</p></TabContentCard>;
    
    default:
      return <CategoryManagement />; // "Mặc định" (Default) "là" (is) "Tab" (Tab) "Danh mục" (Categories)
  }
};

// --- "TRANG" (PAGE) "CHÍNH" (MAIN) ---
const AdminSystemPage = () => {
  // "BỘ NÃO" (BRAIN) "LÀ" (IS) "ĐÂY" (HERE): "Quản lý" (Manages) "tab" (tab) "nào" (which) "đang" (is) "active" (active)
  const [activeTab, setActiveTab] = useState('categories'); 

  return (
    <div className="space-y-6">
      
      {/* 1. "Tiêu đề" (Title) "trang" (page) */}
      <h1 className="text-3xl font-bold text-gray-900">Quản lý Hệ thống</h1>
      
      {/* 2. "Thanh" (Bar) "Điều hướng" (Navigation) "TABS" (TABS) */}
      <div className="border-b border-gray-200 bg-white shadow-sm rounded-t-lg overflow-x-auto">
        <nav className="flex -mb-px space-x-2 px-4">
          <TabButton 
            label="Danh mục Nghề nghiệp" 
            icon={<List size={18} />}
            isActive={activeTab === 'categories'}
            onClick={() => setActiveTab('categories')}
          />
          <TabButton 
            label="Kỹ năng (Tags)" 
            icon={<Brain size={18} />}
            isActive={activeTab === 'skills'}
            onClick={() => setActiveTab('skills')}
          />
          <TabButton 
            label="Từ khóa Cấm (Blacklist)" 
            icon={<ShieldAlert size={18} />}
            isActive={activeTab === 'blacklist'}
            onClick={() => setActiveTab('blacklist')}
          />
        </nav>
      </div>

      {/* 3. "Nội dung" (Content) "của" (of) "Tab" (Tab) "tương ứng" (corresponding) (Phần "thân" (body)) */}
      <div className="mt-4">
        {renderTabContent(activeTab)}
      </div>

    </div>
  );
};

export default AdminSystemPage;