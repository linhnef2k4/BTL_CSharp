import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Zap, Scale } from 'lucide-react';

const features = [
  { name: 'Huy hiệu VIP (⭐)', regular: false, vip: true, desc: 'Nổi bật trong mọi tìm kiếm của nhà tuyển dụng.' },
  { name: 'Tiếp cận HR (InMail)', regular: 'Không', vip: 'Không giới hạn', desc: 'Gửi tin nhắn trực tiếp cho HR.' },
  { name: 'Ưu tiên đề xuất bài viết', regular: false, vip: true, desc: 'Bài viết của bạn được ưu tiên hiển thị.' },
  { name: 'Xem ai đã xem hồ sơ', regular: 'Giới hạn (5)', vip: 'Không giới hạn', desc: 'Biết chính xác công ty nào đang quan tâm.' },
  { name: 'Đăng bài không giới hạn', regular: 'Giới hạn', vip: 'Không giới hạn', desc: 'Thoải mái đăng bài chia sẻ kiến thức.' },
];

const Check = ({ className = '' }) => <CheckCircle className={`h-6 w-6 ${className || 'text-green-500'}`} />;
const Cross = () => <XCircle className="h-6 w-6 text-gray-400" />;

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ComparisonTable = ({ onUpgradeClick }) => {
  return (
    <motion.div
      className="relative mt-10 overflow-hidden rounded-2xl border border-indigo-200 bg-white/80 shadow-2xl backdrop-blur-md"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-1 gap-px md:grid-cols-3">
        
        {/* Cột 1: Header */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white">
          <Scale size={36} className="mb-2 text-yellow-300" />
          <h3 className="text-2xl font-bold">Quyền lợi</h3>
        </div>

        {/* Cột 2: Thường */}
        <div className="flex flex-col items-center justify-center bg-white/90 p-6">
          <h3 className="text-2xl font-semibold text-gray-700">Thường</h3>
          <p className="mt-2 text-gray-500">Miễn phí</p>
        </div>

        {/* Cột 3: VIP */}
        <div className="relative flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white shadow-lg md:scale-105 md:rounded-t-2xl z-10">
          <h3 className="text-3xl font-extrabold text-yellow-300 drop-shadow-sm">VIP</h3>
          <p className="mt-2 text-indigo-100 font-medium">99.999đ / tháng</p>
          <button
            onClick={onUpgradeClick}
            className="mt-4 rounded-full bg-yellow-400 px-6 py-2 font-bold text-indigo-900 shadow hover:bg-yellow-300 transition flex items-center gap-2"
          >
            <Zap size={16} /> Nâng cấp
          </button>
        </div>

        {/* Các dòng tính năng */}
        {features.map((feature, i) => (
          <React.Fragment key={i}>
            <motion.div variants={rowVariants} className="flex flex-col justify-center border-t border-indigo-100 bg-white/90 p-4">
              <p className="font-semibold text-gray-900">{feature.name}</p>
              <p className="text-xs text-gray-500">{feature.desc}</p>
            </motion.div>

            <motion.div variants={rowVariants} className="flex items-center justify-center border-t border-indigo-100 bg-white/80 p-4">
              {typeof feature.regular === 'boolean' ? (feature.regular ? <Check /> : <Cross />) : <span className="font-medium text-gray-700">{feature.regular}</span>}
            </motion.div>

            <motion.div variants={rowVariants} className="flex items-center justify-center border-t border-indigo-100 bg-indigo-50/80 p-4">
              {typeof feature.vip === 'boolean' ? (feature.vip ? <Check className="text-indigo-600" /> : <Cross />) : <span className="font-bold text-indigo-700">{feature.vip}</span>}
            </motion.div>
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default ComparisonTable;