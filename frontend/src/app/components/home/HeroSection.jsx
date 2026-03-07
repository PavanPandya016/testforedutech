import { motion } from "motion/react";

const picsum = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const HERO_IMAGES = {
  hero1: picsum("hero1", 500, 500),
  hero2: picsum("hero2", 500, 500),
};

function DecorCircle({ color, size, style }) {
  return (
    <div className="absolute pointer-events-none" style={style} aria-hidden="true">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
      </svg>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="bg-[#fffaf5] relative overflow-hidden" aria-label="Hero">
      <DecorCircle color="#ED4459" size={10} style={{ left: 34, top: 20 }} />
      <DecorCircle color="#6D39E9" size={12} style={{ left: 753, top: 30 }} />
      <DecorCircle color="#FFC27A" size={15} style={{ right: 100, top: 40 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Copy */}
          <motion.div
            className="text-[#06213d] space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block bg-white px-6 py-3 rounded-full text-sm font-semibold text-[#14627a] shadow-sm tracking-widest"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            >
              START TO SUCCESS
            </motion.span>

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
                
                5,000+
                
              </motion.span>{" "}
              Courses
              <br />from <span className="text-[#14627a]">300</span> Instructors
              <br />& Institutions
            </motion.h1>

            <motion.p
              className="text-[18px] md:text-[20px] text-[#6d737a]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            >
              Learn at your own pace with world-class instructors and institutions.
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
                className="flex-1 px-6 py-4 rounded-lg text-[16px] text-[#6d737a] bg-white focus:outline-none focus:ring-2 focus:ring-[#14627a] shadow-sm"
              />
              <motion.button
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
            className="hidden lg:block relative h-[400px]"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            aria-hidden="true"
          >
            <motion.img
              src={HERO_IMAGES.hero1}
              alt=""
              className="absolute rounded-lg shadow-2xl w-[50%] -rotate-5 z-10"
              style={{ left: "0%", top: "0%" }}
              whileHover={{ rotate: -2, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.img
              src={HERO_IMAGES.hero2}
              alt=""
              className="absolute rounded-lg shadow-2xl w-[48%] rotate-4 z-20"
              style={{ right: "0%", top: "5%" }}
              whileHover={{ rotate: 6, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
