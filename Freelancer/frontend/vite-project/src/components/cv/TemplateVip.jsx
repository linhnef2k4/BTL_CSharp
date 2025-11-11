import React from 'react';
import { Phone, Mail, MapPin, Briefcase, Book, Star } from 'lucide-react';

// --- Component con cho "Tiêu đề Mục" (cho "sạch") ---

// Cột Phải (Nội dung chính)
const SectionRight = ({ title, icon, children }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center space-x-2">
      {icon}
      <span>{title}</span>
    </h2>
    <div className="text-gray-700 space-y-4">
      {children}
    </div>
  </div>
);

// Cột Trái (Thông tin phụ)
const SectionLeft = ({ title, icon, children }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
      {icon}
      <span>{title}</span>
    </h2>
    <div className="text-gray-200 text-sm space-y-2">
      {children}
    </div>
  </div>
);

// Component con cho "Kỹ năng" (có thanh "progress" xịn)
const Skill = ({ name }) => (
  <div>
    <span className="font-medium">{name}</span>
    <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
      <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}></div>
      {/* width (70-100%) "giả lập" độ "pro" */}
    </div>
  </div>
);

// --- Component Mẫu CV "VIP" ---
const TemplateVip = ({ data }) => {
  const { personal, summary, experience, education, skills } = data;

  return (
    // Giả lập 1 trang A4
    <div className="w-full bg-white font-sans text-gray-900 flex">
      
      {/* ========================================
        CỘT TRÁI (VIP): Màu "Gradient", Avatar, Contact, Skills
        ========================================
      */}
      <div className="w-1/3 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8">
        {/* 1. Avatar (To, Tròn) */}
        <div className="flex justify-center mb-6">
          <img 
            src={personal.avatar} 
            alt="Avatar" 
            className="h-32 w-32 rounded-full border-4 border-yellow-400 object-cover shadow-lg"
          />
        </div>

        {/* 2. Liên hệ (Contact) */}
        <SectionLeft title="Liên hệ" icon={<Phone size={16} />}>
          <div className="flex items-center space-x-2">
            <Phone size={14} className="flex-shrink-0" />
            <span>{personal.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={14} className="flex-shrink-0" />
            <span>{personal.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={14} className="flex-shrink-0" />
            <span>{personal.address}</span>
          </div>
        </SectionLeft>
        
        {/* 3. Kỹ năng (Skills) (Thanh "progress" xịn) */}
        <SectionLeft title="Kỹ năng" icon={<Star size={16} />}>
          {skills.map(skill => (
            <Skill key={skill.id} name={skill.name} />
          ))}
        </SectionLeft>
      </div>

      {/* ========================================
        CỘT PHẢI (Nội dung chính): Tên, Giới thiệu, Kinh nghiệm, Học vấn
        ========================================
      */}
      <div className="w-2/3 bg-white p-8">
        {/* 1. Header (Tên & Chức danh) */}
        <header className="mb-6">
          <h1 className="text-5xl font-bold text-gray-900">{personal.fullName}</h1>
          <h2 className="text-2xl font-semibold text-blue-700 mt-1">{personal.title}</h2>
        </header>

        {/* 2. Giới thiệu (Summary) */}
        <SectionRight title="Giới thiệu" icon={<Briefcase size={20} className="text-blue-700" />}>
          <p className="text-sm italic text-gray-600">{summary}</p>
        </SectionRight>

        {/* 3. Kinh nghiệm */}
        <SectionRight title="Kinh nghiệm" icon={<Briefcase size={20} className="text-blue-700" />}>
          {experience.map(exp => (
            <div key={exp.id} className="relative pl-4 border-l-2 border-blue-200">
              <span className="absolute -left-2 top-1 h-3 w-3 rounded-full bg-blue-700"></span>
              <h3 className="text-lg font-semibold">{exp.title}</h3>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-800">{exp.company}</span>
                <span className="text-gray-500">{exp.years}</span>
              </div>
              <p className="text-sm mt-1">{exp.desc}</p>
            </div>
          ))}
        </SectionRight>

        {/* 4. Học vấn */}
        <SectionRight title="Học vấn" icon={<Book size={20} className="text-blue-700" />}>
          {education.map(edu => (
            <div key={edu.id} className="relative pl-4 border-l-2 border-blue-200">
              <span className="absolute -left-2 top-1 h-3 w-3 rounded-full bg-blue-700"></span>
              <h3 className="text-lg font-semibold">{edu.degree}</h3>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-800">{edu.school}</span>
                <span className="text-gray-500">{edu.years}</span>
              </div>
            </div>
          ))}
        </SectionRight>

      </div>
    </div>
  );
};

export default TemplateVip;