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

export default function CourseCard({ course, index, highlighted = false }) {
  const { id, title, category, price, rating, reviews, image } = course;
  return (
    <motion.div
      className="flex-shrink-0 w-[320px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/course/${id}`} className="block h-full" aria-label={`View ${title}`}>
        <motion.article
          className="bg-white rounded-2xl overflow-hidden h-full"
          style={{ boxShadow: "0px 3px 12px 0px rgba(75,75,75,0.08)" }}
          whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative h-52 overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
            <span className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-md text-sm font-medium text-[#1b1d1f] shadow-sm">
              {category}
            </span>
          </div>

          <div className="p-5">
            <h3 className="text-[18px] font-medium text-[#363a3d] mb-3 truncate">{title}</h3>

            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={rating} />
              <span className="text-[16px] text-[#52565c]">({reviews})</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[24px] font-semibold text-[#1b1d1f]">
                ${price.toLocaleString()}
              </span>
              <motion.div
                className={`p-2.5 rounded-lg ${highlighted
                  ? "bg-[#14627a] shadow-[-4px_4px_20px_0px_rgba(32,180,134,0.12)]"
                  : "bg-white shadow-[0px_3px_12px_0px_rgba(75,75,75,0.08)]"
                  }`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                aria-hidden="true"
              >
                <ArrowUpRightIcon color={highlighted ? "white" : "#6D737A"} />
              </motion.div>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
