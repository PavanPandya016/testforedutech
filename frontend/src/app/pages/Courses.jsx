import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

import courseService from '../services/courseService';

// ---------- Improved Presentational Helpers ----------
function CourseCard({ course }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(20,98,122,0.12)] transition-all duration-300 border border-gray-100 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="backdrop-blur-md bg-white/80 text-[#14627a] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm border border-white/20 uppercase tracking-widest">
            {course.level}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 bg-[#FFC27A] text-[#06213d] text-[11px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
          ★ {course.rating}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <span className="text-[#14627a] text-[10px] font-bold uppercase tracking-widest mb-2 block opacity-70">
          {typeof course.category === 'object' ? course.category.name : course.category}
        </span>
        <h3 className="text-lg font-bold text-[#06213d] mb-2 leading-tight group-hover:text-[#14627a] transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-[#6d737a] text-sm mb-6 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="mt-auto pt-5 border-t border-gray-50 flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Price</span>
            <p className="text-xl font-black text-[#14627a]">
              {course.price === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                `$${course.price}`
              )}
            </p>
          </div>
          <Link
            to={`/apply?course=${encodeURIComponent(course.title)}`}
            className="bg-[#06213d] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-[#14627a] transform active:scale-95 transition-all shadow-md"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FiltersSidebar({
  searchTerm, onSearchChange, paid, free, togglePaid, toggleFree,
  levels, selectedLevels, toggleLevel, categories, selectedCategories,
  toggleCategory, clear, hasActive,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const FilterGroup = ({ title, children, count }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6 border-b border-gray-100 last:border-0"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[11px] font-black text-[#011627] uppercase tracking-[0.2em]">
          {title}
        </h3>
        {count > 0 && (
          <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-[#14627a] text-white text-[9px] rounded-full font-black shadow-sm">
            {count}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  );

  const CheckboxItem = ({ label, checked, onChange }) => (
    <label className="flex items-center group cursor-pointer py-2 px-1 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer appearance-none w-5 h-5 rounded-lg border-2 border-gray-200 checked:bg-[#14627a] checked:border-[#14627a] transition-all cursor-pointer"
        />
        <svg className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className={`ml-3 text-sm transition-all duration-300 ${checked ? 'text-[#14627a] font-bold' : 'text-[#6d737a] font-medium group-hover:text-[#06213d]'}`}>
        {label}
      </span>
    </label>
  );

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-8 left-6 z-50 bg-[#14627a] text-white w-14 h-14 rounded-2xl shadow-[0_20px_40px_rgba(20,98,122,0.3)] flex items-center justify-center border border-white/20 backdrop-blur-sm"
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#06213d]/40 backdrop-blur-md z-[60] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-[85%] max-w-[320px] bg-white lg:hidden p-8 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-[#011627]">Filters</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                <FiltersContent {...{ searchTerm, onSearchChange, paid, free, togglePaid, toggleFree, levels, selectedLevels, toggleLevel, categories, selectedCategories, toggleCategory, clear, hasActive, FilterGroup, CheckboxItem, setIsOpen }} />
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="w-full mt-6 bg-[#14627a] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#14627a]/20"
              >
                Show Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:block lg:sticky lg:top-24 w-80 shrink-0">
        <div className="bg-white rounded-[40px] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.03)] border border-gray-100 ring-1 ring-gray-50">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black text-[#011627] tracking-tight">Filters</h2>
            {hasActive && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clear} 
                className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors flex items-center gap-1.5"
              >
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Reset
              </motion.button>
            )}
          </div>

          <FiltersContent {...{ searchTerm, onSearchChange, paid, free, togglePaid, toggleFree, levels, selectedLevels, toggleLevel, categories, selectedCategories, toggleCategory, clear, hasActive, FilterGroup, CheckboxItem }} />
        </div>
      </aside>
    </>
  );
}

function FiltersContent({
  searchTerm, onSearchChange, paid, free, togglePaid, toggleFree,
  levels, selectedLevels, toggleLevel, categories, selectedCategories,
  toggleCategory, clear, hasActive, FilterGroup, CheckboxItem, setIsOpen
}) {
  return (
    <div className="space-y-4">
      <div className="relative group">
        <input
          type="text"
          placeholder="Search masterclasses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-10 py-4 bg-gray-50/50 border-2 border-transparent rounded-[20px] focus:ring-0 focus:border-[#14627a]/20 focus:bg-white outline-none text-sm font-medium transition-all placeholder:text-gray-400"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-[#14627a] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        {searchTerm && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <FilterGroup title="Pricing" count={(paid ? 1 : 0) + (free ? 1 : 0)}>
        <div className="space-y-1">
          <CheckboxItem label="Paid Courses" checked={paid} onChange={togglePaid} />
          <CheckboxItem label="Free Access" checked={free} onChange={toggleFree} />
        </div>
      </FilterGroup>

      <FilterGroup title="Level" count={selectedLevels.length}>
        <div className="space-y-1">
          {levels.map(lvl => (
            <CheckboxItem key={lvl} label={lvl} checked={selectedLevels.includes(lvl)} onChange={() => toggleLevel(lvl)} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Categories" count={selectedCategories.length}>
        <div className="flex flex-wrap gap-2.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-wider transition-all duration-300 transform active:scale-95 ${
                selectedCategories.includes(cat)
                  ? 'bg-[#14627a] text-white shadow-[0_10px_20px_rgba(20,98,122,0.2)]'
                  : 'bg-gray-50 text-[#6d737a] hover:bg-gray-100 hover:text-[#06213d]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [paid, setPaid] = useState(false);
  const [free, setFree] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesData();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && courses.length > 0) {
      // Find the name for this slug from available courses
      const foundCourse = courses.find(c => {
        const cat = c.category;
        if (typeof cat === 'object') {
          return cat.slug === categoryParam || cat.name?.toLowerCase() === categoryParam.toLowerCase();
        }
        return cat?.toLowerCase() === categoryParam.toLowerCase();
      });

      if (foundCourse) {
        const name = typeof foundCourse.category === 'object' ? foundCourse.category.name : foundCourse.category;
        setSelectedCategories([name]);
      }
    } else if (!categoryParam) {
      setSelectedCategories([]);
    }
    
    const searchParam = searchParams.get('search');
    setSearchTerm(searchParam || '');
  }, [searchParams, courses]);

  const categories = useMemo(() => {
    const names = courses.map(c => typeof c.category === 'object' ? c.category.name : c.category);
    return [...new Set(names)].filter(Boolean);
  }, [courses]);
  
  const levels = useMemo(() => ['Beginner', 'Intermediate', 'Advanced'], []);

  const toggleSelection = useCallback((setter, value) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  }, []);

  const handleClear = useCallback(() => {
    setSearchTerm(''); setPaid(false); setFree(false);
    setSelectedCategories([]); setSelectedLevels([]);
    setSearchParams({});
  }, [setSearchParams]);

  const hasActive = searchTerm !== '' || paid || free || selectedCategories.length > 0 || selectedLevels.length > 0;

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q);
      const matchesPrice = (!paid && !free) || (paid && course.isPaid) || (free && !course.isPaid);
      const catName = typeof course.category === 'object' ? course.category.name : course.category;
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(catName);
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);
      return matchesSearch && matchesPrice && matchesCategory && matchesLevel;
    });
  }, [searchTerm, paid, free, selectedCategories, selectedLevels, courses]);

  return (
    <div className="bg-[#fcfdfe] min-h-screen font-sans">
      <Header />

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <header className="mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl lg:text-6xl font-black text-[#06213d] tracking-tighter mb-4">
              Expand your <span className="text-[#14627a]">horizon.</span>
            </h1>
            <p className="text-[#6d737a] text-lg max-w-xl font-medium leading-relaxed">
              Curated masterclasses from industry experts. Choose your path and start building today.
            </p>
          </motion.div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <FiltersSidebar
            searchTerm={searchTerm} onSearchChange={setSearchTerm}
            paid={paid} free={free} togglePaid={() => setPaid(!paid)} toggleFree={() => setFree(!free)}
            levels={levels} selectedLevels={selectedLevels} toggleLevel={(lvl) => toggleSelection(setSelectedLevels, lvl)}
            categories={categories} selectedCategories={selectedCategories} toggleCategory={(cat) => toggleSelection(setSelectedCategories, cat)}
            clear={handleClear} hasActive={hasActive}
          />

          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#06213d]">
                {loading ? '...' : `${filteredCourses.length} results found`}
              </h3>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[420px] bg-gray-100 rounded-[32px] animate-pulse" />
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#06213d] mb-2">No matches found</h3>
                <p className="text-gray-500 mb-8">Try adjusting your filters or search terms.</p>
                <button onClick={handleClear} className="bg-[#14627a] text-white px-8 py-3 rounded-xl font-bold shadow-lg">
                  View All Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
