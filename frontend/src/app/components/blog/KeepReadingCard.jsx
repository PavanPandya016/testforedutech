import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export default function KeepReadingCard({ article }) {
  const navigate = useNavigate();
  const initials = article.author.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -10 }}
      onClick={() => navigate(`/blog/${article.id}`)}
      className="bg-[rgba(255,255,255,0.8)] rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] overflow-hidden cursor-pointer group"
    >
      <div className="relative h-48 sm:h-[224px] overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#14627a] shadow-sm">
          {article.category}
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-['Merriweather:Bold',sans-serif] text-xl sm:text-2xl text-[#101828] leading-snug mb-3 line-clamp-2 group-hover:text-[#14627a] transition-colors">
          {article.title}
        </h3>
        <p className="font-['Roboto:Regular',sans-serif] text-sm sm:text-base text-[#4a5565] leading-relaxed line-clamp-3 mb-4">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14627a] to-[#0d4d5e] flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initials}
            </div>
            <span className="font-medium text-sm text-[#101828]">{article.author}</span>
          </div>
          <span className="text-[#14627a] flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Read <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
