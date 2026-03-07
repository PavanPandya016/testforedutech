import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

// Simple Stat Component with hover effect
function StatItem({ value, label }) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      className="cursor-default"
    >
      <p
        className="text-2xl sm:text-3xl font-bold text-[#0183AB]"
        style={{ fontFamily: "'Public Sans', sans-serif" }}
      >
        {value}
      </p>
      <p
        className="text-xs sm:text-sm text-[#6d737a] mt-1"
        style={{ fontFamily: "'Public Sans', sans-serif" }}
      >
        {label}
      </p>
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="bg-white flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#14627a] to-[#0183AB] py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Animated background shape for flair */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-white font-semibold leading-tight mb-4"
            style={{ fontFamily: "'Public Sans', sans-serif" }}
          >
            ABOUT EDUTECH
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-sm sm:text-base md:text-lg max-w-xl mx-auto mt-3"
            style={{ fontFamily: "'Public Sans', sans-serif" }}
          >
            Bridging the gap between academic knowledge and industry readiness.
          </motion.p>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] text-[#1b1d1f] font-semibold mb-5 leading-snug"
              style={{ fontFamily: "'Public Sans', sans-serif" }}
            >
              The Most Innovative Way to Empower Next-Gen Talent
            </motion.h2>
            <motion.div
              variants={itemVariants}
              className="text-sm sm:text-base md:text-[18px] lg:text-[20px] text-[#6d737a] leading-relaxed space-y-4 max-w-3xl mx-auto"
              style={{ fontFamily: "'Public Sans', sans-serif" }}
            >
              <p>
                At Tejeel Innovations LLP, our vision is to bridge the gap between academic knowledge and industry
                readiness. We are committed to providing scalable, future-focused training programs...
              </p>
              <p>
                Since our inception in 2021, we've helped thousands of learners across India build the skills they need
                to thrive in the modern workforce.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <div className="border-y border-gray-100 bg-white">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
        >
          <StatItem value="2021" label="Founded" />
          <StatItem value="10K+" label="Learners Trained" />
          <StatItem value="50+" label="College Partners" />
          <StatItem value="4" label="Tech Domains" />
        </motion.div>
      </div>

      {/* Mission Section */}
      <section className="bg-[#f8f9fa] py-12 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            viewport={{ once: true }}
            className="flex justify-center mb-6"
          >
            <div className="w-12 h-12 rounded-full bg-[#e8f5f9] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#0183AB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center"
          >
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] text-[#1b1d1f] font-semibold mb-5"
              style={{ fontFamily: "'Public Sans', sans-serif" }}
            >
              Mission
            </motion.h2>
            <motion.div
              variants={itemVariants}
              className="text-sm sm:text-base md:text-[18px] lg:text-[20px] text-[#6d737a] leading-relaxed space-y-4 max-w-3xl mx-auto"
              style={{ fontFamily: "'Public Sans', sans-serif" }}
            >
              <p>
                To deliver world-class tech education through real-world projects, expert mentorship, and AI-driven
                learning platforms...
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-[36px] text-center text-[#1b1d1f] font-semibold mb-10"
            style={{ fontFamily: "'Public Sans', sans-serif" }}
          >
            What Drives Us
          </motion.h2>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { title: 'Innovation', desc: 'We constantly evolve...', iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
              { title: 'Accessibility', desc: 'Quality tech education...', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
              { title: 'Impact', desc: 'Every program we design...', iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-100 rounded-xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[#e8f5f9] flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[#0183AB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.iconPath} />
                  </svg>
                </div>
                <h3 className="text-[#1b1d1f] font-semibold text-base sm:text-lg mb-2">{item.title}</h3>
                <p className="text-[#6d737a] text-sm sm:text-base leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
