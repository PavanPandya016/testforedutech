export default function AuthorBio({ author, category }) {
  const initials = author.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 flex items-start gap-6 border border-gray-100 shadow-sm mb-16">
      <div className="w-20 h-20 bg-gradient-to-br from-[#14627a] to-[#0d4d5e] rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-inner">
        {initials}
      </div>
      <div>
        <h3 className="text-xl font-bold text-[#06213d] mb-2">{author}</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          Tech enthusiast and expert contributor focusing on {category} and modern software engineering practices. Passionate about sharing knowledge and building scalable applications.
        </p>
        <button className="text-[#14627a] font-semibold text-sm border border-[#14627a] px-4 py-1.5 rounded-full hover:bg-[#14627a] hover:text-white transition-colors">
          Follow
        </button>
      </div>
    </div>
  );
}
