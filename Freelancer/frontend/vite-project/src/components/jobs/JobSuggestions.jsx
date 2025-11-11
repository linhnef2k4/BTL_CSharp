import React from 'react';
import { Link } from 'react-router-dom';

// Dữ liệu "giả"
const vipCompanies = [
  { id: 1, name: 'FPT Software', logo: 'https://placehold.co/40x40/f03c2e/ffffff?text=F', slogan: 'Tuyển 1000 Devs' },
  { id: 2, name: 'Viettel Solutions', logo: 'https://placehold.co/40x40/00a14b/ffffff?text=V', slogan: 'Môi trường Sáng tạo' },
  { id: 3, name: 'Teko Vietnam', logo: 'https://placehold.co/40x40/ff7e1a/ffffff?text=T', slogan: 'Đang tuyển 50+' },
];

const potentialCandidates = [
  { id: 1, name: 'Nguyễn Sáng', avatar: 'https://ui-avatars.com/api/?name=NS', title: 'Senior React Dev' },
  { id: 2, name: 'Phạm Văn Huy', avatar: 'https://ui-avatars.com/api/?name=PH', title: 'Fullstack .NET' },
];

const JobSuggestions = () => {
  return (
    <div className="sticky top-20 space-y-4">
      {/* Card 1: Công ty/HR VIP */}
      <div className="rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-2xl">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          Công ty nổi bật
        </h3>
        <div className="space-y-3">
          {vipCompanies.map((company) => (
            <Link key={company.id} to={`/company/${company.id}`} className="flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100">
              <img src={company.logo} alt="Logo" className="h-10 w-10 rounded-lg" />
              <div>
                <h4 className="font-semibold text-sm text-blue-600">{company.name}</h4>
                <p className="text-xs text-gray-500">{company.slogan}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Card 2: Ứng viên tiềm năng (Theo yêu cầu của bạn) */}
      <div className="rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:shadow-2xl">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          Ứng viên tiềm năng
        </h3>
        <div className="space-y-3">
          {potentialCandidates.map((candidate) => (
            <Link key={candidate.id} to={`/profile/${candidate.name.replace(' ', '-')}`} className="flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100">
              <img src={candidate.avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
              <div>
                <h4 className="font-semibold text-sm">{candidate.name}</h4>
                <p className="text-xs text-gray-500">{candidate.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobSuggestions;