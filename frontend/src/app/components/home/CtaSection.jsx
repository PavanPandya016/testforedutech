import { motion } from "motion/react";

const picsum = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

function DecorCircle({ color, size, style, className = "" }) {
  return (
    <div className={`absolute pointer-events-none ${className}`} style={style} aria-hidden="true">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
      </svg>
    </div>
  );
}

function SpinningStarDecor({ className = "" }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      aria-hidden="true"
    >
      <svg className="w-10 h-10" viewBox="0 0 42 42" fill="#FFC27A">
        <path d="M21 0C21 11.598 11.598 21 0 21C11.598 21 21 30.402 21 42C21 30.402 30.402 21 42 21C30.402 21 21 11.598 21 0Z" />
      </svg>
    </motion.div>
  );
}

export default function CtaSection({ image, title, subtitle, buttonText, buttonLink }) {
  const ctaImage = image;

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[rgba(235,243,255,0.7)] overflow-hidden" aria-labelledby="cta-heading">
      <div className="hidden sm:block">
        <DecorCircle color="#14627A" size={20} style={{ left: "10%", top: "50%" }} />
        <DecorCircle color="#F9475D" size={18} style={{ left: "25%", top: "10%" }} />
      </div>
      <DecorCircle color="#6D39E9" size={48} style={{ right: "15%", bottom: "10%" }} className="hidden sm:block lg:bottom-[20%]" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {ctaImage && (
              <div className="border-2 border-[#0f4a63] rounded-[40px] md:rounded-[70px] p-4 md:p-8 overflow-hidden">
                <img src={ctaImage} alt="Promotion" className="rounded-[30px] md:rounded-[70px] w-full h-full object-cover" />
              </div>
            )}
            <SpinningStarDecor className="-right-8 top-1/2 -translate-y-1/2" />
          </motion.div>

          {/* Copy */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[32px] md:text-[40px] font-semibold text-[#06213d] leading-tight">
              {title || "Upgrade Your Skills with Expert-Led Learning"}
            </h2>
            <p className="text-[20px] md:text-[24px] text-[#06213d]">
              {subtitle || "Join thousands of learners and start building real-world skills today."}
            </p>
            <motion.a
              href={buttonLink || "/signup"}
              className="inline-block bg-[#14627a] text-white px-8 py-4 rounded-lg text-[16px] font-medium"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(20,98,122,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              {buttonText || "Sign up for Free"}
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
