import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Star, Zap, Scale } from 'lucide-react';

// Danh sách tính năng
const features = [
  { name: 'Huy hiệu VIP (⭐)', regular: false, vip: true, desc: 'Nổi bật trong mọi tìm kiếm của nhà tuyển dụng.' },
  { name: 'Tiếp cận HR (InMail)', regular: 'Không', vip: '5 lượt/tháng', desc: 'Gửi tin nhắn trực tiếp cho HR (kể cả khi chưa kết nối).' },
  { name: 'Ưu tiên đề xuất bài viết', regular: false, vip: true, desc: 'Bài viết của bạn được ưu tiên hiển thị trong hệ thống.' },
  { name: 'Xem ai đã xem hồ sơ', regular: 'Giới hạn (5)', vip: 'Không giới hạn', desc: 'Biết chính xác công ty nào đang “săn” bạn.' },
  { name: 'Bài viết Chuyên sâu (Blog)', regular: 'Giới hạn (1000 ký tự)', vip: 'Không giới hạn (Full Editor)', desc: 'Xây dựng thương hiệu cá nhân chuyên nghiệp.' },
  { name: 'Hồ sơ Nâng cao (Video, Portfolio)', regular: false, vip: true, desc: 'Thêm video CV, portfolio dự án vào hồ sơ của bạn.' },
];

const Check = ({ className = '' }) => <CheckCircle className={`h-6 w-6 ${className || 'text-green-500'}`} />;
const Cross = () => <XCircle className="h-6 w-6 text-gray-400" />;

const tableVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ComparisonTable = ({ onUpgradeClick }) => {
  return (
    <motion.div
      className="relative mt-16 overflow-hidden rounded-2xl border border-indigo-200 bg-white/70 shadow-2xl backdrop-blur-md"
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hiệu ứng galaxy nền động */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.2),transparent_70%),radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.2),transparent_70%)] animate-[pulse_6s_ease-in-out_infinite]" />

      <div className="relative z-10 grid grid-cols-1 gap-px rounded-2xl md:grid-cols-3">
        
        {/* === Cột 1: Tiêu đề bảng === */}
        <motion.div
          variants={rowVariants}
          className="flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 p-6 text-white md:rounded-tl-2xl"
        >
          <Scale size={36} className="mb-2 text-yellow-300 animate-pulse" />
          <h3 className="text-2xl font-bold">Tính năng</h3>
          <p className="mt-1 text-sm text-indigo-100">So sánh chi tiết các quyền lợi</p>
        </motion.div>

        {/* === Cột 2: Thường === */}
        <motion.div variants={rowVariants} className="flex flex-col items-center justify-center bg-white/80 p-6">
          <h3 className="text-2xl font-semibold text-gray-700">Thường</h3>
          <p className="mt-2 text-gray-500">Miễn phí</p>
          <button
            disabled
            className="mt-4 rounded-full border border-gray-300 px-6 py-2 text-gray-400 cursor-not-allowed"
          >
            Tài khoản của bạn
          </button>
        </motion.div>

        {/* === Cột 3: VIP === */}
        <motion.div
          variants={rowVariants}
          className="relative flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 p-6 text-white shadow-[0_0_25px_rgba(79,70,229,0.6)] md:scale-105 md:rounded-tr-2xl transition-all duration-500 hover:shadow-[0_0_35px_rgba(236,72,153,0.8)]"
        >
          <h3 className="text-3xl font-extrabold drop-shadow-md">VIP</h3>
          <p className="mt-2 text-indigo-100">Chỉ 99k / tháng</p>
          <motion.button
            onClick={onUpgradeClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="mt-5 inline-flex items-center space-x-2 rounded-full bg-yellow-400 px-6 py-2 font-semibold text-indigo-900 shadow-lg hover:bg-yellow-300"
          >
            <Zap size={18} />
            <span>Nâng cấp</span>
          </motion.button>
        </motion.div>

        {/* === Các dòng tính năng === */}
        {features.map((feature, i) => (
          <React.Fragment key={i}>
            {/* Cột 1: Tên tính năng */}
            <motion.div
              variants={rowVariants}
              className="flex items-center border-t border-indigo-100 bg-white/80 p-4 backdrop-blur-sm"
            >
              <div>
                <p className="font-semibold text-gray-900">{feature.name}</p>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            </motion.div>

            {/* Cột 2: Thường */}
            <motion.div
              variants={rowVariants}
              className="flex items-center justify-center border-t border-indigo-100 bg-white/70 p-4"
            >
              {typeof feature.regular === 'boolean'
                ? feature.regular
                  ? <Check />
                  : <Cross />
                : <span className="font-medium text-gray-700">{feature.regular}</span>}
            </motion.div>

            {/* Cột 3: VIP */}
            <motion.div
              variants={rowVariants}
              className="flex items-center justify-center border-t border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:scale-105 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              {typeof feature.vip === 'boolean'
                ? feature.vip
                  ? <Check className="text-indigo-600" />
                  : <Cross />
                : <span className="font-bold text-indigo-700">{feature.vip}</span>}
            </motion.div>
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default ComparisonTable;
