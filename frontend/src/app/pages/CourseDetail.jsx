import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import svgPaths from "../../imports/svg-78otquld5h";
import { imgStarColor } from "../../imports/svg-nvm9s";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

// extracted styles object moved to separate file for readability
import styles from './CourseDetail.styles';

const randomInstructorImg = "https://picsum.photos/200/200?random=1";
const randomCourseImg = "https://picsum.photos/400/250?random=2";

// style that depends on imported image path
const starHalfFillStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '50%',
  height: '100%',
  backgroundColor: '#ffc500',
  maskImage: `url('${imgStarColor}')`,
  maskSize: '18px 17.193px',
  maskRepeat: 'no-repeat',
  maskPosition: '0px 0px',
};

const MainBody = () => {
  const navigate = useNavigate();
  // State for toggling course content sections
  const [expandedSection, setExpandedSection] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  // Helper for rendering stars
  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => {
      if (star <= Math.floor(rating)) {
        return (
          <svg key={star} style={styles.starFull} fill="none" viewBox="0 0 18 17.1927">
            <path d={svgPaths.p46fad00} fill="#FFC500" />
          </svg>
        );
      }
      // Simplified half-star logic for the demo
      return (
        <svg key={star} style={styles.starEmpty} fill="none" viewBox="0 0 18 17.1927">
          <path d={svgPaths.p46fad00} fill="#E0E8F1" />
        </svg>
      );
    });
  };

  const COURSE_TITLE = "Introduction to Kubernetes";

  const handleApply = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      // Redirect to login and preserve the course selection
      const redirectUrl = encodeURIComponent(`/apply?course=${encodeURIComponent(COURSE_TITLE)}`);
      navigate(`/login?redirect=${redirectUrl}`);
      return;
    }
    // Pass the exact course title
    navigate(`/apply?course=${encodeURIComponent(COURSE_TITLE)}`);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-b from-[#f0f7fa] to-white px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-xs md:text-sm text-[#6d737a] mb-4 font-medium">
            IT & Software &gt; Network & Security &gt; Kubernetes
          </div>
          
          <h1 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-bold text-[#14627a] mb-4 leading-tight">
            {COURSE_TITLE}
          </h1>
          <p className="text-[14px] sm:text-[16px] md:text-[18px] text-[#6d737a] mb-6 leading-relaxed max-w-3xl">
            Want to learn Kubernetes? Get an in-depth primer on this powerful system for managing containerized applications in this free course.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 flex-wrap">
            <motion.div 
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"
              whileHover={{ scale: 1.05 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 19">
                <path d={svgPaths.p277b7b30} fill="#4A4459" />
              </svg>
              <span className="text-xs md:text-sm font-semibold text-[#1b1d1f]">Best Seller</span>
            </motion.div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <span className="text-[#6d737a]">Created by</span>
              <span className="font-semibold text-[#1b1d1f]">Spoongebob</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24">
                <path d={svgPaths.p6ddf300} fill="#9FC3CE" />
              </svg>
              <span className="text-[#6d737a]">Updated 12/2025</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 20 20">
                <path d={svgPaths.p3df1ee00} fill="#9FC3CE" />
              </svg>
              <span className="text-[#6d737a]">English</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl font-['Public_Sans:Medium',sans-serif]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <main className="lg:col-span-2 space-y-8">
            
            {/* Rating Card */}
            <motion.div 
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e0f2f7]"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 bg-[#e8f5f0] px-3 py-2 rounded-lg w-fit mb-6">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 22 22">
                  <path d={svgPaths.p13300500} stroke="#14627a" strokeWidth="2" />
                </svg>
                <span className="text-xs md:text-sm font-semibold text-[#14627a]">Verified</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#14627a] mb-2">4.5</div>
                  <div className="flex gap-1 justify-center mb-2">{renderStars(4.5)}</div>
                  <div className="text-xs md:text-sm text-[#6d737a]">100,000 ratings</div>
                </div>
                
                <div className="text-center">
                  <svg className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2" fill="none" viewBox="0 0 31 26">
                    <path d={svgPaths.paaca4c0} stroke="#1E1E1E" strokeWidth="2" />
                  </svg>
                  <div className="text-xl md:text-2xl font-bold text-[#1b1d1f] mb-1">400,000</div>
                  <div className="text-xs md:text-sm text-[#6d737a]">learners</div>
                </div>
              </div>
            </motion.div>

            {/* What you'll learn */}
            <motion.section 
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e0f2f7]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-[#1b1d1f] mb-6">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array(6).fill('Gain basic understanding of Kubernetes Fundamentals').map((text, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 text-[#14627a]" fill="none" viewBox="0 0 17 12">
                      <path d={svgPaths.p20166f70} fill="currentColor" />
                    </svg>
                    <span className="text-xs md:text-sm text-[#6d737a]">{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Course Content Accordion */}
            <motion.section 
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e0f2f7]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-[#1b1d1f] mb-6">Course content</h2>
              <div className="space-y-2">
                {[
                  { title: 'Introduction', lectures: '6 lectures', duration: '7 min' },
                  { title: 'Kubernetes Architecture', lectures: '12 lectures', duration: '45 min' },
                  { title: 'Pods & Services', lectures: '10 lectures', duration: '30 min' },
                  { title: 'Exam Preparation', lectures: '50 Questions', duration: '60 min' }
                ].map((item, i) => (
                  <div key={i} className="border border-[#e0e8f1] rounded-lg overflow-hidden">
                    <motion.div 
                      className="flex items-center gap-3 md:gap-4 p-4 md:p-5 cursor-pointer hover:bg-[#f8fafb] transition-colors"
                      onClick={() => toggleSection(i)}
                      whileHover={{ backgroundColor: '#f8fafb' }}
                    >
                      <svg 
                        className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24"
                        style={{ transform: expandedSection === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        <path d={svgPaths.p39dcce80} fill="#6d737a" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-semibold text-[#1b1d1f] truncate">{item.title}</h3>
                      </div>
                      <span className="text-xs md:text-sm text-[#6d737a] whitespace-nowrap">{item.lectures} • {item.duration}</span>
                    </motion.div>
                    <AnimatePresence>
                      {expandedSection === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-[#f8fafb] border-t border-[#e0e8f1] p-4 md:p-5"
                        >
                          <p className="text-xs md:text-sm text-[#6d737a]">Lecture details and preview videos would go here.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Instructor Section */}
            <motion.section 
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e0f2f7]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-[#1b1d1f] mb-6">Instructors</h2>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start"
                whileHover={{ y: -5 }}
              >
                <img 
                  src={randomInstructorImg} 
                  alt="Instructor" 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-[#1b1d1f] mb-2">Spongebob Squarepants</h3>
                  <div className="text-sm md:text-base text-[#6d737a] mb-1">4.9 Instructor Rating</div>
                  <div className="text-sm md:text-base text-[#6d737a]">430,393 Reviews</div>
                </div>
              </motion.div>
            </motion.section>
          </main>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e0f2f7] sticky top-24 lg:top-32"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={randomCourseImg} 
                alt="Kubernetes" 
                className="w-full rounded-lg mb-6 object-cover h-40 md:h-48"
              />
              <div className="mb-6">
                <div className="mb-4">
                  <div className="text-2xl md:text-3xl font-bold text-[#14627a] mb-1">$20</div>
                  <div className="text-sm text-[#6d737a]">Full Course + Exam</div>
                </div>
                <motion.button 
                  onClick={handleApply}
                  className="w-full bg-gradient-to-r from-[#14627a] to-[#0f4a5b] text-white font-semibold py-3 md:py-4 rounded-lg hover:from-[#0f4a5b] hover:to-[#083a47] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  APPLY NOW
                </motion.button>
              </div>
              <div className="space-y-3 border-t border-[#e0e8f1] pt-6">
                <motion.div 
                  className="flex items-center gap-2 text-sm md:text-base"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-[#14627a] font-bold">✓</span>
                  <span className="text-[#6d737a]">Beginner Level</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 text-sm md:text-base"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-[#14627a] font-bold">✓</span>
                  <span className="text-[#6d737a]">12 Months Access</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 text-sm md:text-base"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-[#14627a] font-bold">✓</span>
                  <span className="text-[#6d737a]">Certificate of Completion</span>
                </motion.div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};


const CourseDetail = () => {
  return (
    <>
      <Header />
      <MainBody />
      <Footer />
    </>
  );
};

// styles moved to CourseDetail.styles.js
export default CourseDetail;
