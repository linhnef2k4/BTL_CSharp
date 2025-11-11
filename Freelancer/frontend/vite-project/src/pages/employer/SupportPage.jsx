import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// "Import" (Import) "thêm" (more) "icon" (icon) "cho" (for) "Card" (Card) "Góp Ý" (Feedback)
import { Send, AlertCircle, LifeBuoy, PhoneCall, ThumbsUp, Mail } from 'lucide-react'; 

// "Logic" (Logic) "Validate" (Validation) "cho" (for) "Form" (Form) (Giữ "nguyên" (same))
const schema = yup.object().shape({
  topic: yup
    .string()
    .required('Vui lòng chọn một chủ đề.')
    .notOneOf([''], 'Vui lòng chọn một chủ đề.'), 
  message: yup
    .string()
    .required('Vui lòng nhập nội dung cần hỗ trợ.')
    .min(20, 'Nội dung cần ít nhất 20 ký tự để chúng tôi hiểu rõ vấn đề.'),
});

const SupportPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "submit" (submit) "form" (form) (Giữ "nguyên" (same))
  const onSubmit = (data) => {
    console.log('Gửi Yêu cầu Hỗ trợ:', data);
    reset();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Liên hệ Hỗ trợ</h1>
      
      {/* --- "LAYOUT" (LAYOUT) "2" (TWO) "CỘT" (COLUMNS) (ĐÃ "NÂNG CẤP" (UPGRADED) "CARD" (CARD) "SỐ 2" (NUMBER 2)) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CỘT 1: FORM "GỬI" (SEND) "MAIL" (MAIL) (2/3 "chiều rộng" (width)) (Giữ "nguyên" (same)) */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-lg h-full">
            
            <div className="flex items-center gap-3 mb-4">
              <LifeBuoy size={24} className="text-blue-600" />
              <p className="text-gray-600">
                Đối với các vấn đề không khẩn cấp, hãy gửi form. Đội ngũ hỗ trợ sẽ phản hồi trong vòng 24 giờ.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* 1. Chọn "Chủ đề" (Topic) (Giữ "nguyên" (same)) */}
              <div>
                <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-1">
                  Chủ đề của bạn là gì? *
                </label>
                <select
                  id="topic"
                  {...register('topic')}
                  className={`w-full rounded-lg border-gray-300 py-2.5 shadow-sm 
                              focus:border-blue-500 focus:ring-blue-500
                              ${errors.topic ? 'border-red-500 ring-red-500' : ''}`}
                >
                  <option value="">-- Chọn một chủ đề --</option>
                  <option value="bug_report">Báo lỗi kỹ thuật</option>
                  <option value="vip_question">Hỏi về Gói VIP</option>
                  <option value="complaint">Khiếu nại / Báo cáo</option>
                  <option value="other">Khác</option>
                </select>
                {errors.topic && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.topic.message}
                  </p>
                )}
              </div>

              {/* 2. "Nội dung" (Message) (Giữ "nguyên" (same)) */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                  Mô tả vấn đề của bạn *
                </label>
                <textarea
                  id="message"
                  rows={8}
                  {...register('message')}
                  placeholder="Tôi đang gặp vấn đề với..."
                  className={`w-full rounded-lg border-gray-300 shadow-sm 
                              focus:border-blue-500 focus:ring-blue-500
                              ${errors.message ? 'border-red-500 ring-red-500' : ''}`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.message.message}
                  </p>
                )}
              </div>
              
              {/* 3. Nút "Gửi" (Submit) (Giữ "nguyên" (same)) */}
              <div className="text-right">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 
                             font-semibold text-white shadow-lg transition-all 
                             hover:scale-105 hover:bg-blue-700 
                             disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={18} />
                  {isSubmitting ? 'Đang gửi...' : 'Gửi Yêu cầu'}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* CỘT 2: "CARD" (CARD) "HOTLINE" (HOTLINE) "VÀ" (AND) "CARD" (CARD) "MỚI" (NEW) (1/3 "chiều rộng" (width)) */}
        <div className="lg:col-span-1">
          <div className="space-y-6">

            {/* CARD 1: HOTLINE (Giữ "nguyên" (same) "sticky" (sticky)) */}
            <div className="sticky top-20 rounded-xl bg-blue-50 border border-blue-200 p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <PhoneCall size={24} className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Hỗ trợ Khẩn cấp</h3>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Đối với các vấn đề nghiêm trọng (thanh toán, sập web), vui lòng gọi trực tiếp:
              </p>
              <p className="text-3xl font-bold text-blue-600 my-4 text-center">
                1900 1234
              </p>
              <a 
                href="tel:19001234"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 
                           font-semibold text-white shadow-lg transition-all 
                           hover:scale-105 hover:bg-blue-700"
              >
                <PhoneCall size={18} />
                Gọi Ngay (9h-17h)
              </a>
            </div>

            {/* CARD 2: "GÓP Ý" (FEEDBACK) / "HỢP TÁC" (PARTNERSHIP) (THAY THẾ (REPLACED) "CHO" (FOR) "VAT") */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <ThumbsUp size={24} className="text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">Góp ý & Hợp tác</h3>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Bạn có ý tưởng cải thiện nền tảng? Hoặc muốn thảo luận về hợp tác chiến lược?
              </p>
              <p className="text-lg font-semibold text-blue-600 my-2 text-center break-words">
                partners@jobconnect.vn
              </p>
              {/* "Nút" (Button) "mailto:" "để" (to) "mở" (open) "app" (app) "mail" (mail) "lên" (up) */}
              <a 
                href="mailto:partners@jobconnect.vn?subject=Góp ý/Hợp tác"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 
                           font-semibold text-white shadow-lg transition-all 
                           hover:scale-105 hover:bg-gray-700"
              >
                <Mail size={18} />
                Gửi Email Góp Ý
              </a>
            </div>
            {/* HẾT "CARD" (CARD) "MỚI" (NEW) */}

          </div>
        </div>

      </div>
    </div>
  );
};

export default SupportPage;