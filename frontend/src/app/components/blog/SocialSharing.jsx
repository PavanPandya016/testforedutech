import { Heart, MessageSquare, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function SocialSharing({ likes, commentsCount = 24 }) {
  return (
    <div className="border-t border-b border-gray-100 py-6 mb-16 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-6 text-gray-500 font-medium">
        <button className="flex items-center gap-2 hover:text-red-500 transition-colors group">
          <Heart size={20} className="group-hover:fill-red-500 transition-all" /> 
          <span>{likes || 124} Likes</span>
        </button>
        <div className="w-1 h-1 bg-gray-300 rounded-full" />
        <button className="flex items-center gap-2 hover:text-[#14627a] transition-colors group">
          <MessageSquare size={20} className="group-hover:fill-[#14627a]/20 transition-all" /> 
          <span>{commentsCount} Comments</span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
          <Share2 size={16} /> Share:
        </span>
        <button className="w-10 h-10 rounded-full bg-blue-50 text-[#1da1f2] flex items-center justify-center hover:bg-[#1da1f2] hover:text-white transition-all shadow-sm hover:shadow-md">
          <Twitter size={18} />
        </button>
        <button className="w-10 h-10 rounded-full bg-blue-50 text-[#0077b5] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all shadow-sm hover:shadow-md">
          <Linkedin size={18} />
        </button>
        <button className="w-10 h-10 rounded-full bg-blue-50 text-[#1877f2] flex items-center justify-center hover:bg-[#1877f2] hover:text-white transition-all shadow-sm hover:shadow-md">
          <Facebook size={18} />
        </button>
      </div>
    </div>
  );
}
