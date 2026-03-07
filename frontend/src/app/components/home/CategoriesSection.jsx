import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowUpRightIcon } from "../ui/Icons";

export default function CategoriesSection({ categories }) {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 id="categories-heading" className="text-[32px] md:text-[40px] font-semibold text-[#06213d] mb-4">
            Most <span className="text-[#14627a]">Popular</span> Categories
          </h2>
          <p className="text-[18px] md:text-[20px] text-[#6d737a]">
            Explore topics taught by world-class instructors.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link 
              key={category.name}
              to={`/courses?category=${encodeURIComponent(category.name)}`}
              aria-label={`Browse ${category.name} courses`}
            >
              <motion.button
                className="group w-full bg-white rounded-lg p-6 flex items-center justify-between cursor-pointer border border-transparent text-left"
                initial={{
                  y: 0,
                  boxShadow: "0px 3px 12px 0px rgba(75,75,75,0.08)",
                  borderColor: "transparent"
                }}
                whileHover={{
                  y: -5,
                  boxShadow: "0px 10px 30px 0px rgba(75,75,75,0.15)",
                  borderColor: "#14627a"            // border turns teal
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <div className="flex items-center gap-4">
                  <i
                    className={`${category.icon} text-2xl text-[#6d737a]
                       transition-colors duration-100 group-hover:text-[#14627a]`}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[20px] font-medium text-[#1b1d1f]
                       transition-colors duration-100 group-hover:text-[#14627a]"
                  >
                    {category.name}
                  </span>
                </div>
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-lg p-2.5
                     bg-white text-[#6d737a] shadow-[0px_3px_12px_0px_rgba(75,75,75,0.08)]
                     transition-colors duration-100 group-hover:bg-[#14627a]
                     group-hover:text-white"
                  aria-hidden="true"
                >
                  <ArrowUpRightIcon color="currentColor" />
                </div>
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
