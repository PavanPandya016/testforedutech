import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-[#14627a] to-[#0f4a5b] text-white shadow-lg hover:shadow-xl flex items-center justify-center group"
          aria-label="Scroll to top"
          whileHover={{
            scale: 1.1,
            boxShadow: '0 20px 40px rgba(20, 98, 122, 0.4)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path
              d="M12 5V19M5 12L12 5L19 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          
          {/* Tooltip */}
          <motion.div
            className="absolute right-full mr-3 px-3 py-2 bg-[#06213d] text-white rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            Back to top
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 bg-[#06213d] transform rotate-45" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
