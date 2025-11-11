import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

// --- Component con cho "Tiêu đề Mục" (cho "sạch") ---
const Section = ({ title, children }) => (
  <div className="mb-4">
    <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-1 mb-2">
      {title}
    </h2>
    <div className="text-gray-700">
      {children}
    </div>
  </div>
);

// --- Component Mẫu CV "Đơn Giản" ---
const TemplateSimple = ({ data }) => {
  const { personal, summary, experience, education, skills } = data;

  return (
    // Giả lập 1 trang A4
    <div className="w-full bg-white p-10 font-sans text-gray-900">
      
      {/* 1. Header (Tên & Chức danh) */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-800">{personal.fullName}</h1>
        <h2 className="text-xl font-semibold text-gray-600 mt-1">{personal.title}</h2>
      </header>

      {/* 2. Contact Bar (Thanh liên hệ) */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600 border-y py-2 mb-6">
        <div className="flex items-center space-x-1">
          <Phone size={14} />
          <span>{personal.phone}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Mail size={14} />
          <span>{personal.email}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MapPin size={14} />
          <span>{personal.address}</span>
        </div>
      </div>

      {/* 3. Giới thiệu (Summary) */}
      <Section title="Giới thiệu">
        <p className="text-sm italic">{summary}</p>
      </Section>

      {/* 4. Kinh nghiệm */}
      <Section title="Kinh nghiệm">
        <div className="space-y-3">
          {experience.map(exp => (
            <div key={exp.id}>
              <h3 className="text-base font-semibold">{exp.title}</h3>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-800">{exp.company}</span>
                <span className="text-gray-500">{exp.years}</span>
              </div>
              <p className="text-sm mt-1">{exp.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Học vấn */}
      <Section title="Học vấn">
        <div className="space-y-2">
          {education.map(edu => (
            <div key={edu.id} className="flex justify-between">
              <div>
                <h3 className="text-base font-semibold">{edu.degree}</h3>
                <span className="text-sm text-gray-800">{edu.school}</span>
              </div>
              <span className="text-sm text-gray-500">{edu.years}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Kỹ năng */}
      <Section title="Kỹ năng">
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill.id} className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium">
              {skill.name}
            </span>
          ))}
        </div>
      </Section>

    </div>
  );
};

export default TemplateSimple;