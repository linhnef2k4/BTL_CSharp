import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, FilterX } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import JobFilters from './JobFilters';
import JobCard from './JobCard';
import JobSuggestions from './JobSuggestions';
import ToastNotification from '../shared/ToastNotification'; // Đảm bảo đường dẫn đúng
import jobService from '../../../services/jobService';
import { useAuth } from '../../context/AuthContext';

const JobListings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State dữ liệu
  const [allJobs, setAllJobs] = useState([]); // Dữ liệu gốc từ API (theo search term)
  const [displayJobs, setDisplayJobs] = useState([]); // Dữ liệu hiển thị (sau khi filter client-side)
  
  // State UI
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  // 1. CALL API SEARCH (Khi load trang hoặc bấm Tìm)
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Gọi API với tham số tìm kiếm cơ bản
      // Lưu ý: Backend hỗ trợ search theo Title và Location chính
      const params = {
        searchTerm: searchTitle || null,
        location: searchLocation || null, 
      };
      
      const response = await jobService.getJobs(params);
      setAllJobs(response.data); // Lưu vào allJobs
      
      // Sau khi có data mới, áp dụng ngay bộ lọc client-side hiện tại (nếu có)
      applyClientSideFilters(response.data, activeFilters);
      
    } catch (error) {
      console.error("Lỗi tải danh sách việc làm:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lần đầu
  useEffect(() => {
    fetchJobs();
  }, []);

  // 2. LOGIC CLIENT-SIDE FILTER (Cho Checkbox nhiều lựa chọn)
  // Vì Backend chỉ hỗ trợ single value cho Level/WorkType, nên ta lọc thêm ở frontend để UI mượt hơn
  const applyClientSideFilters = (sourceJobs, filters) => {
    let result = [...sourceJobs];

    // Lọc Địa điểm (Checkbox)
    if (filters.locations?.length > 0) {
      result = result.filter(j => filters.locations.includes(j.location));
    }

    // Lọc Cấp bậc
    if (filters.levels?.length > 0) {
      result = result.filter(j => filters.levels.includes(j.level));
    }

    // Lọc Hình thức
    if (filters.types?.length > 0) {
      result = result.filter(j => filters.types.includes(j.workType));
    }

    // Lọc Mức lương (Logic phức tạp: Min Salary job >= Min filter)
    if (filters.salaries?.length > 0) {
      result = result.filter(j => 
        filters.salaries.some(range => {
          const [minStr, maxStr] = range.split('-');
          const minFilter = Number(minStr) * 1000000;
          const maxFilter = maxStr ? Number(maxStr) * 1000000 : Infinity;
          
          // Job phù hợp nếu lương job nằm trong khoảng hoặc giao nhau
          // Logic đơn giản: Job có maxSalary >= minFilter
          const jobMax = j.maxSalary || Infinity;
          const jobMin = j.minSalary || 0;
          
          return jobMax >= minFilter && jobMin <= maxFilter;
        })
      );
    }

    setDisplayJobs(result);
  };

  // Handler khi bấm "Áp dụng" ở Sidebar
  const handleApplyFilters = (filtersFromChild) => {
    setActiveFilters(filtersFromChild);
    applyClientSideFilters(allJobs, filtersFromChild);
  };

  // Handler Search
  const handleSearchClick = () => {
    fetchJobs();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchClick();
  };

  // 3. LOGIC ỨNG TUYỂN (CẦN MODAL HOẶC CHUYỂN TRANG)
  // Vì API cần CoverLetter, nên ta sẽ chuyển hướng sang trang Detail để user nhập
  // Hoặc mở Modal (ở đây ta demo nhanh gọi API)
  const handleApplyJob = async (jobId, jobTitle) => {
    if (!user) {
        alert("Vui lòng đăng nhập để ứng tuyển.");
        navigate('/login');
        return;
    }
    // Redirect sang trang chi tiết để điền form (vì cần CoverLetter)
    navigate(`/jobs/${jobId}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-10">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-4">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <JobFilters onApplyFilters={handleApplyFilters} />
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-2">
            {/* Search Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-2 rounded-xl bg-white p-3 shadow-sm border border-gray-100">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Chức danh, từ khóa..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Địa điểm (Hà Nội...)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full rounded-lg border-gray-200 bg-gray-50 py-2.5 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
              <button 
                onClick={handleSearchClick}
                className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 transition shadow-sm whitespace-nowrap"
              >
                Tìm kiếm
              </button>
            </div>
            
            {/* Job List */}
            <div className="space-y-4">
              {loading ? (
                 <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                 </div>
              ) : displayJobs.length > 0 ? (
                displayJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job}
                    isApplied={appliedJobIds.has(job.id)}
                    onApply={handleApplyJob}
                  />
                ))
              ) : (
                <div className="rounded-xl bg-white p-10 text-center shadow-sm border border-gray-100">
                  <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                     <FilterX className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Không tìm thấy công việc phù hợp</h3>
                  <p className="text-gray-500 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn.</p>
                  <button onClick={() => {
                      setSearchTitle(''); 
                      setSearchLocation(''); 
                      fetchJobs();
                  }} className="mt-4 text-blue-600 font-medium hover:underline">
                      Xóa tìm kiếm
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* SUGGESTIONS */}
          <aside className="hidden lg:col-span-1 lg:block">
            <JobSuggestions />
          </aside>
        </div>
      </div>
      
      <AnimatePresence>
        {toastMessage && (
          <ToastNotification 
            message={toastMessage} 
            onClose={() => setToastMessage(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default JobListings;