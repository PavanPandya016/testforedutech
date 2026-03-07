import { List } from 'lucide-react';

export default function TableOfContents({ toc, activeSection }) {
  if (toc.length === 0) {
    return (
      <div className="sticky top-24 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[#14627a]/10 text-[#14627a] flex items-center justify-center">
            <List size={16} />
          </span>
          Table of Contents
        </h3>
        <p className="text-sm text-gray-400 italic">No headings found.</p>
      </div>
    );
  }

  return (
    <div className="sticky top-24 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-[#14627a]/10 text-[#14627a] flex items-center justify-center">
          <List size={16} />
        </span>
        Table of Contents
      </h3>
      <ul className="space-y-3">
        {toc.map(item => (
          <li key={item.id} className={item.level === 'h3' ? 'ml-4' : ''}>
            <a 
              href={`#${item.id}`} 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-sm font-medium transition-all duration-200 block py-1 border-l-2 pl-3 ${
                activeSection === item.id 
                  ? 'text-[#14627a] border-[#14627a] bg-[#14627a]/5 font-bold' 
                  : 'text-gray-500 border-transparent hover:text-[#14627a] hover:border-gray-200'
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
