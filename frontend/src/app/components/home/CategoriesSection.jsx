import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowUpRightIcon } from "../ui/Icons";
import { courseService } from "../../services/courseService";


// Map category name → Bootstrap icon class
const CATEGORY_ICONS = {
  "Design": "bi-palette",
  "Development": "bi-code-slash",
  "Marketing": "bi-graph-up",
  "Business": "bi-briefcase",
  "Data Science": "bi-bar-chart",
  "Lifestyle": "bi-stars",
  "Photography": "bi-camera",
  "Music": "bi-music-note",
};

const DEFAULT_ICON = "bi-bookmark";

export default function CategoriesSection({ title, subtitle }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        // Returns [{ _id, name, slug, courseCount }, ...]
        const data = await courseService.getCategories();
        if (!cancelled) setCategories(data);
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Failed to load categories");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

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
            {title || "Most Popular Categories"}
          </h2>
          <p className="text-[18px] md:text-[20px] text-[#6d737a]">
            {subtitle || "Explore topics taught by world-class instructors."}
          </p>
        </motion.div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg p-6 h-[76px] bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const icon = CATEGORY_ICONS[category.name] ?? DEFAULT_ICON;
              return (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    to={`/courses?category=${encodeURIComponent(category.slug)}`}
                    aria-label={`Browse ${category.name} courses`}
                  >
                    <motion.div
                      className="group w-full bg-white rounded-lg p-6 flex items-center justify-between cursor-pointer border border-transparent text-left"
                      initial={{
                        y: 0,
                        boxShadow: "0px 3px 12px 0px rgba(75,75,75,0.08)",
                        borderColor: "transparent"
                      }}
                      whileHover={{
                        y: -5,
                        boxShadow: "0px 10px 30px 0px rgba(75,75,75,0.15)",
                        borderColor: "#14627a"
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                          <i
                            className={`${icon} text-2xl text-[#6d737a] transition-colors duration-100 group-hover:text-[#14627a]`}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[18px] font-medium text-[#1b1d1f] transition-colors duration-100 group-hover:text-[#14627a] truncate">
                            {category.name}
                          </span>
                          {category.courseCount > 0 && (
                            <span className="text-[13px] text-[#6d737a] block truncate">
                              {category.courseCount} {category.courseCount === 1 ? "Course" : "Courses"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-lg p-2.5
                           bg-white text-[#6d737a] shadow-[0px_3px_12px_0px_rgba(75,75,75,0.08)]
                           transition-colors duration-100 group-hover:bg-[#14627a]
                           group-hover:text-white"
                        aria-hidden="true"
                      >
                        <ArrowUpRightIcon color="currentColor" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <p className="text-center text-[#6d737a]">No categories found.</p>
        )}
      </div>
    </section>
  );
}
