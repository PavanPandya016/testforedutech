import { motion } from "motion/react";
import { Link } from "react-router-dom";
import StarRating from "../ui/StarRating";

function ArrowUpRightIcon({ color = "#6D737A" }) {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 18L18 6" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M8.25 6H18V15.75" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export default function CourseCard({ course, index }) {
  const { id, title, category, price, rating, reviews, image, description } = course;
  return (
    <motion.div
      className="flex-shrink-0 w-[280px] sm:w-[320px] group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/apply?course=${encodeURIComponent(title)}`} className="block h-full" aria-label={`Apply for ${title}`}>
        <motion.article
          className="bg-white rounded-2xl overflow-hidden h-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100"
          whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(20,98,122,0.12)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative h-52 overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
            <span className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-md text-sm font-medium text-[#1b1d1f] shadow-sm">
              {typeof category === 'object' ? (category.name || 'General') : (category || 'General')}
            </span>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-[#1b1d1f] mb-3 truncate group-hover:text-[#14627a] transition-colors">
              {title}
            </h3>

            <p className="text-sm text-[#6d737a] line-clamp-2 mb-4 h-10 leading-relaxed">
              {description || "Master this subject with expert-led instruction and hands-on projects."}
            </p>

            <div className="flex items-center gap-3 mb-6">
              {course.students > 0 && (
                <span className="text-[12px] text-[#52565c] font-semibold bg-gray-50 px-2 py-1 rounded-md">
                  {course.students.toLocaleString()} students
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Price</span>
                <span className="text-2xl font-black text-[#1b1d1f]">
                  {price === 0 ? <span className="text-green-600">FREE</span> : `$${price.toLocaleString()}`}
                </span>
              </div>
              <motion.div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-[#06213d] text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                whileHover={{ scale: 1.05, backgroundColor: "#14627a" }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Enroll Now</span>
                <ArrowUpRightIcon color="white" />
              </motion.div>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
