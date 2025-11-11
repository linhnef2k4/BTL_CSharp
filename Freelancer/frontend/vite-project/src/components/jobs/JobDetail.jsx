import React from 'react';
import { useParams, Link } from 'react-router-dom';

const JobDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL

  return (
    <div className="container mx-auto p-8">
      <Link to="/jobs" className="text-blue-600 hover:underline">
        &larr; Quay lại danh sách
      </Link>
      <h1 className="mt-4 text-4xl font-bold">Trang Chi Tiết Job</h1>
      <p className="mt-2 text-lg">
        Đây là nơi bạn sẽ hiển thị thông tin chi tiết cho Job ID: <span className="font-bold text-red-500">{id}</span>
      </p>
    </div>
  );
};

export default JobDetail;