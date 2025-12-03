import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Briefcase, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import jobService from '../../../services/jobService';
import { formatSalary, formatTimeAgo } from '../../utils/formatUtils';
import { useAuth } from '../../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyStatus, setApplyStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await jobService.getJobDetail(id);
        setJob(res.data);
      } catch (error) {
        console.error("Lỗi tải chi tiết job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    setApplying(true);
    try {
      // Lưu ý: DTO yêu cầu CvUrl. Backend lấy CV từ Profile, nhưng DTO ApplyToJobDto vẫn yêu cầu trường này?
      // Dựa theo code backend mới: "CvUrl = seeker.ResumeUrl" -> Backend tự lấy.
      // Tuy nhiên, nếu DTO Frontend gửi lên bắt buộc trường CvUrl thì ta phải gửi dummy hoặc link thật.
      // Giả sử backend tự lấy, ta gửi chuỗi rỗng hoặc link placeholder.
      
      await jobService.applyToJob(id, { 
          coverLetter: coverLetter,
          cvUrl: "https://placeholder.com" // Backend đã tự lấy từ DB, nhưng nếu DTO validate Required thì cần gửi.
      });
      
      setApplyStatus('success');
      alert("Ứng tuyển thành công!");
    } catch (error) {
      const msg = error.response?.data || "Có lỗi xảy ra.";
      alert(msg);
      setApplyStatus('error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (!job) return <div className="text-center py-20">Không tìm thấy công việc này.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/jobs" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
           <ArrowLeft size={18} className="mr-1" /> Quay lại danh sách
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* LEFT COLUMN: Job Info */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                 <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                 <div className="flex items-center gap-4 mb-6">
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                       <DollarSign size={18} /> {formatSalary(job.minSalary, job.maxSalary)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                       <Clock size={18} /> {formatTimeAgo(job.createdDate)}
                    </span>
                 </div>

                 <div className="space-y-6">
                    <Section title="Mô tả công việc" content={job.description} />
                    <Section title="Yêu cầu ứng viên" content={job.requirements} />
                    <Section title="Quyền lợi" content={job.benefits} />
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: Company & Apply */}
           <div className="lg:col-span-1 space-y-6">
              {/* Company Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                 <img src={job.logoCompany || 'https://via.placeholder.com/100'} alt="Logo" className="w-20 h-20 mx-auto mb-3 object-contain rounded-lg bg-white border" />
                 <h3 className="font-bold text-lg mb-1">{job.companyName}</h3>
                 <div className="flex justify-center gap-2 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.workType}</span>
                 </div>
                 <Link to={`/profile/${job.employerId}`} className="text-blue-600 text-sm font-medium hover:underline">
                    Xem trang công ty
                 </Link>
              </div>

              {/* Apply Form */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                 <h3 className="font-bold text-gray-800 mb-4">Ứng tuyển ngay</h3>
                 {applyStatus === 'success' ? (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                       <CheckCircle className="mx-auto mb-2" size={32} />
                       <p className="font-medium">Đã gửi hồ sơ thành công!</p>
                    </div>
                 ) : (
                    <form onSubmit={handleApply}>
                       <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Thư giới thiệu</label>
                          <textarea 
                             rows={4}
                             className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                             placeholder="Viết ngắn gọn lý do bạn phù hợp với vị trí này..."
                             value={coverLetter}
                             onChange={(e) => setCoverLetter(e.target.value)}
                             required
                          />
                       </div>
                       <button 
                          type="submit"
                          disabled={applying}
                          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-70 flex justify-center"
                       >
                          {applying ? <Loader2 className="animate-spin" /> : 'Gửi hồ sơ ứng tuyển'}
                       </button>
                       <p className="text-xs text-gray-500 mt-3 text-center">
                          Hệ thống sẽ tự động sử dụng CV trong hồ sơ cá nhân của bạn.
                       </p>
                    </form>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, content }) => (
   <div>
      <h3 className="font-semibold text-gray-900 mb-2 border-l-4 border-blue-600 pl-3">{title}</h3>
      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 rounded-lg">
         {content}
      </p>
   </div>
);

export default JobDetail;