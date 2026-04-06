import { useState, useCallback, useRef, useEffect } from "react";
import { motion, useMotionValue } from "motion/react";
import CourseCard from "./CourseCard";

function CarouselControls({ page, pageCount, onPrev, onNext, onGoTo }) {
  return (
    <motion.div
      className="flex items-center justify-center gap-8 mt-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex gap-3" role="tablist" aria-label="Carousel pages">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === page}
            aria-label={`Go to page ${i + 1}`}
            onClick={() => onGoTo(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${i === page ? "bg-[#14627a] w-8" : "bg-[#cfd3d6] w-2.5"
              }`}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <motion.button
          onClick={onPrev}
          aria-label="Previous"
          className="bg-white p-2.5 rounded-lg shadow-sm border border-gray-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 19.5L7.5 12L15 4.5" stroke="#363A3D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </motion.button>

        <motion.button
          onClick={onNext}
          aria-label="Next"
          className="bg-[#14627a] p-2.5 rounded-lg shadow-[0_10px_20px_rgba(20,98,122,0.2)]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 4.5L16.5 12L9 19.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function PopularCoursesSection({ courses }) {
  if (!courses || courses.length === 0) return null;

  const pageCount = courses.length;
  const [page, setPage] = useState(0);
  const carouselRef = useRef(null);
  const [itemWidth, setItemWidth] = useState(344); // Default fallback

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        const firstItem = carouselRef.current.children[0];
        if (firstItem) {
          // Card width + gap-6 (24px)
          setItemWidth(firstItem.offsetWidth + 24);
        }
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [courses]);

  const prev = useCallback(
    () => setPage((p) => (pageCount > 0 ? (p - 1 + pageCount) % pageCount : 0)),
    [pageCount]
  );
  const next = useCallback(
    () => setPage((p) => (pageCount > 0 ? (p + 1) % pageCount : 0)),
    [pageCount]
  );
  const goTo = useCallback((i) => setPage(i), []);

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-[rgba(235,243,255,0.7)]"
      aria-labelledby="popular-courses-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center mb-8">
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              id="popular-courses-heading"
              className="text-[40px] md:text-[48px] lg:text-[56px] font-semibold text-[#06213d] leading-tight"
            >
              Most <br />
              <span className="relative text-[#14627a] inline-block">
                Popular
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FFC27A] rounded-sm" />
              </span>{" "}
              <br />
              Course
            </h2>
          </motion.div>

          <div className="flex-1 w-full overflow-hidden relative -m-4 p-4 lg:-m-10 lg:p-10">
            <motion.div
              ref={carouselRef}
              className="flex gap-6 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ right: 0, left: -(pageCount - 1) * itemWidth }}
              animate={{ x: -page * itemWidth }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              initial={false}
              role="list"
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = offset.x + velocity.x * 0.2;
                if (swipe < -itemWidth / 4 && page < pageCount - 1) {
                  setPage(page + 1);
                } else if (swipe > itemWidth / 4 && page > 0) {
                  setPage(page - 1);
                }
              }}
            >
              {courses.map((course, index) => (
                <div key={course.id || index} role="listitem">
                  <CourseCard
                    course={course}
                    index={index}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {pageCount > 1 && (
          <CarouselControls
            page={page}
            pageCount={pageCount}
            onPrev={prev}
            onNext={next}
            onGoTo={goTo}
          />
        )}
      </div>
    </section>
  );
}
