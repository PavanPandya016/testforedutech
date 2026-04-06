import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

function DecorCircle({ color, size, style, className = "" }) {
  return (
    <div className={`absolute pointer-events-none ${className}`} style={style} aria-hidden="true">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
      </svg>
    </div>
  );
}

export default function HeroSection({ images, stats, subtitle }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/courses");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const displayCourses = stats?.courses ? `${stats.courses.toLocaleString()}+` : "0";
  const displayInstructors = stats?.instructors ? stats.instructors.toLocaleString() : "0";

  return (
    <section className="bg-[#fffaf5] relative overflow-hidden" aria-label="Hero">
      <DecorCircle color="#ED4459" size={10} style={{ left: 34, top: 20 }} className="hidden sm:block" />
      <DecorCircle color="#6D39E9" size={12} style={{ left: 753, top: 30 }} className="hidden lg:block" />
      <DecorCircle color="#FFC27A" size={15} style={{ right: 100, top: 40 }} className="hidden sm:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Copy */}
          <motion.div
            className="text-[#06213d] space-y-6 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >


            <motion.h1
              className="text-[40px] sm:text-[48px] lg:text-[56px] font-semibold leading-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            >
              Access To{" "}
              <motion.span
                className="text-[#14627a]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >

                {displayCourses}

              </motion.span>{" "}
              Courses
              <br />from <span className="text-[#14627a]">{displayInstructors}</span> Instructors
              <br />& Institutions
            </motion.h1>

            <motion.p
              className="text-[18px] md:text-[20px] text-[#6d737a]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            >
              {subtitle || "Learn at your own pace with world-class instructors and institutions."}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label htmlFor="hero-search" className="sr-only">Search for a course</label>
              <input
                id="hero-search"
                type="search"
                placeholder="What do you want to learn?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-6 py-4 rounded-lg text-[16px] text-[#6d737a] bg-white focus:outline-none focus:ring-2 focus:ring-[#14627a] shadow-sm"
              />
              <motion.button
                onClick={handleSearch}
                className="bg-[#14627a] text-white px-8 py-4 rounded-lg text-[16px] font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(20,98,122,0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi-search text-lg" aria-hidden="true" />
                Search
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Images */}
          <motion.div
            className="relative h-auto lg:h-[400px] mt-8 lg:mt-0 order-1 lg:order-2"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            aria-hidden="true"
          >
            {images?.[0] && (
              <motion.img
                src={images[0]}
                alt=""
                className="relative lg:absolute rounded-lg shadow-xl w-full lg:w-[50%] max-h-[300px] sm:max-h-[400px] lg:max-h-none object-cover rotate-0 lg:-rotate-5 z-10 lg:left-[5%] lg:top-0 mx-auto lg:mx-0"
                whileHover={{ zIndex: 50, scale: 1.05, rotate: -2 }}
                transition={{ duration: 0.3 }}
                fetchpriority="high"
                loading="eager"
              />
            )}

            {images?.[1] && (
              <motion.img
                src={images[1]}
                alt=""
                className="absolute rounded-lg shadow-2xl w-[43%] lg:w-[48%] rotate-4 z-20 hidden lg:block"
                style={{ right: "5%", top: "10%" }}
                whileHover={{ zIndex: 50, scale: 1.05, rotate: 6 }}
                transition={{ duration: 0.3 }}
                fetchpriority="high"
                loading="eager"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
