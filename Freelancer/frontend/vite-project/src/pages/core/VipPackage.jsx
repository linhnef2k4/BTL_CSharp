import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, ChevronRight } from 'lucide-react';
import ComparisonTable from '../../components/vip/ComparisonTable';
import PaymentModal from '../../components/vip/PaymentModal';
import { useAuth } from '../../context/AuthContext';

const VipPackage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const handleOpenModal = () => {
      if (!user) {
          alert("Vui lòng đăng nhập để nâng cấp VIP.");
          return;
      }
      setIsModalOpen(true);
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden text-white bg-gradient-to-b from-indigo-950 via-blue-950 to-black">

        {/* Background Effects (Giữ nguyên hiệu ứng đẹp của bạn) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[200%] h-[200%] animate-bg-move-slow bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_60%)] blur-3xl"></div>
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute rounded-full bg-white opacity-70"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
              }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: Math.random() * 5 + 3, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <motion.div
          className="relative z-10 text-center pt-32 pb-20 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Star className="mx-auto h-20 w-20 text-yellow-400 drop-shadow-[0_0_30px_rgba(255,255,0,0.6)]" fill="currentColor" />
          </motion.div>

          <motion.h1
            className="mt-6 text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-white to-yellow-200 drop-shadow-2xl"
            variants={itemVariants}
          >
            Mở Khóa Tiềm Năng VIP
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-indigo-100 leading-relaxed"
            variants={itemVariants}
          >
            Trở thành ứng viên nổi bật hoặc nhà tuyển dụng uy tín. <br/>
            Đặc quyền không giới hạn chỉ với một bước nâng cấp.
          </motion.p>

          <motion.button
            variants={itemVariants}
            onClick={handleOpenModal}
            className="relative mt-10 inline-flex items-center space-x-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-300 px-10 py-4 text-lg font-bold text-indigo-900 shadow-[0_0_25px_rgba(255,200,0,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,200,0,0.8)]"
          >
            <Zap size={24} className="fill-indigo-900" />
            {/* Sửa giá tiền khớp với Backend */}
            <span>Nâng cấp ngay – 500K</span> 
            <ChevronRight size={24} />
          </motion.button>
        </motion.div>

        {/* Comparison Table */}
        <motion.div 
          className="relative z-10 container mx-auto max-w-6xl px-6 pb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ComparisonTable onUpgradeClick={handleOpenModal} />
        </motion.div>
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default VipPackage;