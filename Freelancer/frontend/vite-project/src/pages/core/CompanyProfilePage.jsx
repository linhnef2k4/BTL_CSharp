import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Users, Globe, CheckCircle, Loader2, Briefcase, ArrowLeft 
} from 'lucide-react';
import profileService from '../../../services/profileService';
import socialService from '../../../services/socialService'; // Để lấy job của công ty
import JobCard from '../../components/jobs/JobCard';

const CompanyProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]); // Danh sách việc làm của công ty
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Lấy thông tin công ty (User Profile)
        const profileRes = await profileService.getUserProfile(id);
        setProfile(profileRes.data);

        // 2. Lấy danh sách job của công ty này (Workaround: Lấy all feed job rồi lọc)
        // (Sau này bạn nên có API: /api/projects/employer/{id})
        try {
            // Tạm thời giả lập hoặc dùng API getFeed nếu API getProjectsByEmployer chưa có
            // Ở đây tôi demo UI trước, bạn có thể tích hợp API getProjectsByEmployer sau
        } catch (err) {
            console.warn(err);
        }

      } catch (error) {
        console.error("Lỗi tải trang công ty:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="flex justify-center h-screen items-center"><Loader2 className="animate-spin text-blue-600" size={40}/></div>;
  if (!profile || !profile.employer) return <div className="text-center py-20">Không tìm thấy thông tin công ty.</div>;

  const emp = profile.employer;
  const logoUrl = emp.logoCompany || emp.companyLogoUrl || `https://placehold.co/100x100/00529c/ffffff?text=${emp.companyName.charAt(0)}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Cover & Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="h-48 w-full bg-gradient-to-r from-blue-700 to-blue-500"></div>
        <div className="container mx-auto px-4 max-w-5xl">
           <div className="relative -mt-16 px-4 pb-6 flex flex-col md:flex-row items-end gap-6">
              <div className="p-1 bg-white rounded-xl shadow-md">
                 <img src={logoUrl} alt="Logo" className="w-32 h-32 rounded-lg object-contain bg-white border border-gray-100" />
              </div>
              <div className="flex-1 mb-1">
                 <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {emp.companyName}
                    {emp.isVip && <CheckCircle className="text-blue-500" size={24} />}
                 </h1>
                 <div className="flex flex-wrap gap-4 text-gray-600 mt-2 text-sm">
                    {emp.address && <span className="flex items-center gap-1"><MapPin size={16}/> {emp.address}</span>}
                    <span className="flex items-center gap-1"><Users size={16}/> {emp.companySize} nhân viên</span>
                    {emp.companyWebsite && (
                        <a href={emp.companyWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                            <Globe size={16}/> Website
                        </a>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-5xl mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left: About */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Giới thiệu công ty</h3>
               <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {emp.companyDescription || "Chưa có mô tả giới thiệu về công ty này."}
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase size={20}/> Tuyển dụng đang mở
               </h3>
               {/* List Jobs */}
               <div className="space-y-4">
                  <p className="text-gray-500 italic">Hiện chưa có tin tuyển dụng nào được hiển thị.</p>
                  {/* {jobs.map(job => <JobCard key={job.id} job={job} />)} */}
               </div>
            </div>
         </div>

         {/* Right: Info */}
         <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
               <h4 className="font-bold text-gray-800 mb-3">Thông tin liên hệ</h4>
               <div className="space-y-3 text-sm text-gray-600">
                  <p><span className="font-medium">MST:</span> {emp.taxCode}</p>
                  <p><span className="font-medium">Email HR:</span> {profile.email}</p>
                  <p><span className="font-medium">SĐT:</span> {profile.phoneNumber || "Đang cập nhật"}</p>
               </div>
            </div>
            
            <Link to="/jobs" className="block w-full text-center py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700 transition">
               <ArrowLeft size={16} className="inline mr-1"/> Quay lại tìm việc
            </Link>
         </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;