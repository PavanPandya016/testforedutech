import { useState } from "react";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getOptimizedImage } from "../../utils/imageOptimizer";
import { Search } from "lucide-react";

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
          <m.div
            className="text-[#06213d] space-y-6 order-2 lg:order-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >


            <m.h1
              className="text-[40px] sm:text-[48px] lg:text-[56px] font-semibold leading-tight"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
            >
              Access To{" "}
              <m.span className="text-[#14627a]">
                {displayCourses}
              </m.span>{" "}
              Courses
              <br />from <span className="text-[#14627a]">{displayInstructors}</span> Instructors
              <br />& Institutions
            </m.h1>

            <m.p
              className="text-[18px] md:text-[20px] text-[#6d737a]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            >
              {subtitle || "Learn at your own pace with world-class instructors and institutions."}
            </m.p>

            <m.div
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
              <m.button
                onClick={handleSearch}
                className="bg-[#14627a] text-white px-8 py-4 rounded-lg text-[16px] font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(20,98,122,0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                  <Search className="w-5 h-5" aria-hidden="true" />
                Search
              </m.button>
            </m.div>
          </m.div>

          {/* Images */}
          <m.div
            className="relative h-[300px] sm:h-[400px] lg:h-[400px] mt-8 lg:mt-0 order-1 lg:order-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div 
              className="relative lg:absolute rounded-lg shadow-xl w-full lg:w-[50%] h-full bg-gray-100 rotate-0 lg:-rotate-5 z-10 lg:left-[5%] lg:top-0 mx-auto lg:mx-0 overflow-hidden"
              style={{ aspectRatio: '600/400', minHeight: '240px' }}
            >
              {images?.[0] ? (
                <m.img
                  src={getOptimizedImage(images[0], { width: 600, height: 400 })}
                  alt="Students learning and collaborating on eduTech"
                  width="600"
                  height="400"
                  decoding="async"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  transition={{ duration: 0.3 }}
                  fetchpriority="high"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
            </div>

            <div 
              className="absolute rounded-lg shadow-2xl w-[43%] lg:w-[48%] h-[350px] bg-gray-200 rotate-4 z-20 hidden lg:block overflow-hidden"
              style={{ right: "5%", top: "10%" }}
            >
              {images?.[1] ? (
                <m.img
                  src={getOptimizedImage(images[1], { width: 500, height: 350 })}
                  alt="Expert instructor teaching a course"
                  width="500"
                  height="350"
                  decoding="async"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05, rotate: 6 }}
                  transition={{ duration: 0.3 }}
                  fetchpriority="high"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 animate-pulse" />
              )}
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
