import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, ChevronRight } from 'lucide-react';
import ComparisonTable from '../../components/vip/ComparisonTable';
import PaymentModal from '../../components/vip/PaymentModal';

const VipPackage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.25 } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 100 } 
    },
  };

  return (
    <>
      <div className="min-h-screen relative overflow-hidden text-white bg-gradient-to-b from-indigo-950 via-blue-950 to-black">

        {/* 🌌 Lớp nền thiên hà lung linh */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 🌫 Lớp tinh vân di chuyển chậm */}
          <div className="absolute w-[250%] h-[250%] animate-bg-move-slow 
              bg-[radial-gradient(circle_at_30%_40%,rgba(99,102,241,0.4),transparent_70%),_radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.3),transparent_70%),_radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.15),transparent_80%)] blur-3xl">
          </div>

          {/* ✨ Lớp sao nhỏ - bay chậm */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`starslow-${i}`}
              className="absolute rounded-full bg-white opacity-70 blur-[1px]"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.9, 0.4],
              }}
              transition={{
                duration: Math.random() * 8 + 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* 🌟 Lớp sao sáng - bay nhanh hơn, lấp lánh mạnh hơn */}
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={`starfast-${i}`}
              className="absolute rounded-full bg-white opacity-90 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
                y: [0, -15, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* 🌠 Hiệu ứng sao băng */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`shooting-${i}`}
              className="absolute h-[2px] w-[140px] bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
              initial={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 80}%`,
                rotate: -45,
                opacity: 0,
              }}
              animate={{
                x: [0, 1000],
                y: [0, 600],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 6 + 3,
              }}
            />
          ))}
        </div>

        {/* 🌟 Hero Section */}
        <motion.div
          className="relative z-10 text-center pt-32 pb-28 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Star className="mx-auto h-20 w-20 text-yellow-400 drop-shadow-[0_0_30px_rgba(255,255,0,0.7)]" fill="currentColor" />
          </motion.div>

          <motion.h1
            className="mt-6 text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-white to-yellow-300 drop-shadow-xl"
            variants={itemVariants}
          >
            Mở Khóa Tiềm Năng Của Bạn
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-indigo-200 leading-relaxed"
            variants={itemVariants}
          >
            Bước vào thế giới VIP — nơi bạn tỏa sáng giữa hàng ngàn ứng viên khác.  
            Tăng khả năng hiển thị, ưu tiên việc làm, và mở khóa trải nghiệm cao cấp.
          </motion.p>

          <motion.button
            variants={itemVariants}
            onClick={() => setIsModalOpen(true)}
            className="relative mt-12 inline-flex items-center space-x-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 px-10 py-4 text-lg font-bold text-indigo-900 shadow-[0_0_25px_rgba(255,223,0,0.8)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,0,1)]"
          >
            <Zap size={26} className="animate-bounce-slow" />
            <span>Nâng cấp ngay – chỉ 99K/tháng</span>
            <ChevronRight size={26} />
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-200 via-white to-yellow-400 opacity-30 blur-xl animate-pulse-slow"></span>
          </motion.button>
        </motion.div>

        {/* 🌈 Section bảng so sánh */}
        <motion.div 
          className="relative z-10 container mx-auto max-w-6xl px-6 py-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-center text-4xl font-bold text-yellow-300 mb-4 drop-shadow-[0_0_20px_rgba(255,255,0,0.4)]">
            So Sánh Các Gói Tài Khoản
          </h2>
          <p className="mt-2 text-center text-lg text-gray-200 mb-10">
            Trải nghiệm sự khác biệt giữa tài khoản thường và thành viên VIP.
          </p>

          <ComparisonTable onUpgradeClick={() => setIsModalOpen(true)} />
        </motion.div>
      </div>

      {/* Modal thanh toán */}
      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default VipPackage;
