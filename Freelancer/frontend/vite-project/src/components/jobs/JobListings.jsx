import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
// Đảm bảo đường dẫn này đúng với cấu trúc của bạn
import JobFilters from '../../components/jobs/JobFilters';
import JobCard from '../../components/jobs/JobCard';
import JobSuggestions from '../../components/jobs/JobSuggestions';
import ToastNotification from '../../components/shared/ToastNotification';

// 1. DATA "THẬT" (Nâng cấp)
const mockJobs = [
  { id: 1, title: 'Senior React Developer', companyName: 'FPT Software', companyLogo: 'https://placehold.co/56x56/f03c2e/ffffff?text=F', salary: '30 - 50 triệu', salaryValue: 40, location: 'Hà Nội', level: 'Senior', type: 'Full-time', postedTime: '2 giờ trước', isHot: true },
  { id: 2, title: '.NET Developer (Fresher/Junior)', companyName: 'Viettel Solutions', companyLogo: 'https://placehold.co/56x56/00a14b/ffffff?text=V', salary: 'Thỏa thuận', salaryValue: 12, location: 'Đà Nẵng', level: 'Junior', type: 'Full-time', postedTime: '5 giờ trước', isHot: false },
  { id: 3, title: 'UI/UX Designer', companyName: 'Teko Vietnam', companyLogo: 'https://placehold.co/56x56/ff7e1a/ffffff?text=T', salary: '20 - 25 triệu', salaryValue: 22, location: 'Hồ Chí Minh', level: 'Junior', type: 'Remote', postedTime: '1 ngày trước', isHot: false },
  { id: 4, title: 'Lead .NET Developer', companyName: 'MISA', companyLogo: 'https://placehold.co/56x56/00529c/ffffff?text=M', salary: 'Trên 50 triệu', salaryValue: 55, location: 'Hồ Chí Minh', level: 'Lead', type: 'Full-time', postedTime: '2 ngày trước', isHot: true },
  { id: 5, title: 'Fresher Tester', companyName: 'FPT Software', companyLogo: 'https://placehold.co/56x56/f03c2e/ffffff?text=F', salary: '5 - 8 triệu', salaryValue: 6, location: 'Hà Nội', level: 'Fresher', type: 'Part-time', postedTime: '3 ngày trước', isHot: false },
  { id: 6, title: 'React Native (Remote)', companyName: 'Teko Vietnam', companyLogo: 'https://placehold.co/56x56/ff7e1a/ffffff?text=T', salary: 'Thỏa thuận', salaryValue: 28, location: 'Remote', level: 'Senior', type: 'Remote', postedTime: '4 ngày trước', isHot: false },
];

const JobListings = () => {
  const [allJobs] = useState(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  // 2. LOGIC LỌC VÀ SEARCH (ĐÃ NÂNG CẤP)
  const handleSearchAndFilter = () => {
    let tempJobs = [...allJobs];

    // Lọc bằng Search Title
    if (searchTitle) {
      tempJobs = tempJobs.filter(j => j.title.toLowerCase().includes(searchTitle.toLowerCase()));
    }
    // Lọc bằng Search Location (ô search trên cùng)
    if (searchLocation) {
      tempJobs = tempJobs.filter(j => j.location.toLowerCase().includes(searchLocation.toLowerCase()));
    }

    // --- LOGIC LỌC BỘ LỌC (CHECKBOX) ---

    // Lọc bằng Checkbox: Địa điểm (MỚI)
    if (activeFilters.locations?.length > 0) {
      tempJobs = tempJobs.filter(j => activeFilters.locations.includes(j.location));
    }
    // Lọc bằng Checkbox: Mức lương
    if (activeFilters.salaries?.length > 0) {
      tempJobs = tempJobs.filter(j => 
        activeFilters.salaries.some(range => {
          const [min, max] = range.split('-').map(Number);
          if (max) return j.salaryValue >= min && j.salaryValue <= max;
          return j.salaryValue >= min;
        })
      );
    }
    // Lọc bằng Checkbox: Cấp bậc
    if (activeFilters.levels?.length > 0) {
      tempJobs = tempJobs.filter(j => activeFilters.levels.includes(j.level));
    }
    // Lọc bằng Checkbox: Hình thức
    if (activeFilters.types?.length > 0) {
      tempJobs = tempJobs.filter(j => activeFilters.types.includes(j.type));
    }

    setFilteredJobs(tempJobs);
  };

  // Hàm này được gọi từ JobFilters khi bấm "Áp dụng"
  const handleApplyFilters = (filtersFromChild) => {
    setActiveFilters(filtersFromChild);
    // Phải gọi handleSearchAndFilter() sau khi state đã được cập nhật
    // Chúng ta "lách" bằng cách dùng setTimeout 0
    setTimeout(handleSearchAndFilter, 0); 
  };
  
  // Nút "Tìm" cũng gọi hàm search chính
  const handleSearchClick = () => {
     handleSearchAndFilter();
  };
  
  // Bắt phím Enter
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchAndFilter();
    }
  };

  // 3. LOGIC ỨNG TUYỂN (MỚI)
  const handleApplyJob = (jobId, jobTitle) => {
    setAppliedJobIds(prev => new Set(prev).add(jobId));
    setToastMessage(`Đã ứng tuyển vào ${jobTitle}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-4">
          
          <aside className="lg:col-span-1">
            <JobFilters onApplyFilters={handleApplyFilters} />
          </aside>

          <main className="lg:col-span-2">
            <div className="mb-6 flex space-x-2 rounded-xl bg-white p-3 shadow-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Chức danh, từ khóa..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full rounded-lg border-gray-300 py-2.5 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Địa điểm..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full rounded-lg border-gray-300 py-2.5 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={handleSearchClick}
                className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700"
              >
                Tìm
              </button>
            </div>
            
            <div className="space-y-5">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job}
                    isApplied={appliedJobIds.has(job.id)}
                    onApply={handleApplyJob}
                  />
                ))
              ) : (
                <div className="rounded-xl bg-white p-8 text-center shadow-lg">
                  <h3 className="text-xl font-semibold">Không tìm thấy Job phù hợp</h3>
                  <p className="text-gray-500">Vui lòng thử thay đổi từ khóa hoặc bộ lọc.</p>
                </div>
              )}
            </div>
          </main>

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