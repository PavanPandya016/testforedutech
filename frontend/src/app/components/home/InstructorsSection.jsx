import { motion } from "motion/react";

export default function InstructorsSection({ instructors, title, subtitle }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[rgba(235,243,255,0.7)]" aria-labelledby="instructors-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 id="instructors-heading" className="text-[32px] md:text-[40px] font-semibold text-[#06213d] mb-4">
            {title || "Our Best Instructors"}
          </h2>
          <p className="text-[18px] md:text-[20px] text-[#6d737a]">
            {subtitle || "Learn from industry leaders who are passionate about teaching."}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor._id || instructor.id}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-4 mb-4"
                style={{ boxShadow: "0px 3px 12px 0px rgba(75,75,75,0.08)" }}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-4 bg-[#ececec]">
                  <img src={instructor.img || instructor.image} alt={instructor.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h3 className="text-[18px] font-normal text-[#1b1d1f] mb-1">{instructor.name}</h3>
                <p className="text-[14px] text-[#6d737a]">{instructor.studyArea || instructor.specialty} Expert</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
