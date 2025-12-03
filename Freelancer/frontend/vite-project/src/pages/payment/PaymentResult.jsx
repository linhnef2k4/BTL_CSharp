import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Home, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PaymentResult = () => {
  const { status } = useParams(); // Lấy param 'success' hoặc 'failed' từ URL
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  
  const isSuccess = status === 'success';

  useEffect(() => {
    // Nếu thanh toán thành công, gọi lại API User (refetchUser) 
    // để cập nhật ngay lập tức trạng thái VIP và ngày hết hạn mới nhất từ server
    if (isSuccess) {
        refetchUser();
    }
  }, [isSuccess, refetchUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
        
        {/* Icon trạng thái */}
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <div className="bg-green-100 p-4 rounded-full animate-bounce-slow">
               <CheckCircle className="w-20 h-20 text-green-600" />
            </div>
          ) : (
            <div className="bg-red-100 p-4 rounded-full">
               <XCircle className="w-20 h-20 text-red-600" />
            </div>
          )}
        </div>

        {/* Tiêu đề */}
        <h1 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
          {isSuccess ? 'Giao dịch Thành công!' : 'Giao dịch Thất bại'}
        </h1>

        {/* Mô tả */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {isSuccess 
            ? 'Chúc mừng! Tài khoản của bạn đã được nâng cấp/gia hạn VIP thành công. Hãy tận hưởng các đặc quyền ngay bây giờ.'
            : 'Giao dịch đã bị hủy hoặc có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'}
        </p>

        {/* Nút điều hướng */}
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition"
          >
            <Home size={18} /> Về trang chủ
          </button>
          
          {!isSuccess && (
             <button 
                onClick={() => navigate('/vip-package')}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
             >
                <RefreshCcw size={18} /> Thử lại
             </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default PaymentResult;