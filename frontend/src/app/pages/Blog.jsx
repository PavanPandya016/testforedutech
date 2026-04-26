import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import { Search, PlusCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { api } from '../services/api/api';
import { getOptimizedImage } from '../utils/imageOptimizer';

const categoryColors = {
  Development: 'bg-[#14627a]',
  DevOps: 'bg-[#125364]',
  Performance: 'bg-[#1b8a93]',
  Architecture: 'bg-[#0d4d5e]',
  Cloud: 'bg-[#16a5b1]',
  'Data Science': 'bg-[#17b3c1]',
  'AI/ML': 'bg-[#19c1cf]',
  Security: 'bg-[#14627a]',
  Design: 'bg-[#FFC27A] text-[#06213d]',
  Business: 'bg-[#0d4d5e]',
};

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('Latest');
  const [userRole, setUserRole] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [categories, setCategories] = useState(['All']);
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to normalize a backend post into the shape the UI expects
  const normalizePost = (post) => {
    const authorObj = post.author || {};
    const authorName = authorObj.firstName
      ? `${authorObj.firstName} ${authorObj.lastName || ''}`.trim()
      : (typeof authorObj === 'string' ? authorObj : 'EduTech');
    const categoryName = post.category?.name || post.category || 'General';
    const htmlContent = post.content || '';
    const words = htmlContent.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length;
    return {
      ...post,
      id: post._id || post.id,
      image: post.featuredImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      author: authorName,
      date: post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Recent',
      readTime: `${Math.max(1, Math.ceil(words / 200))} min read`,
      category: categoryName,
      tags: (post.tags || []).map(t => (typeof t === 'object' ? t.name : t)),
      excerpt: post.excerpt || '',
      slug: post.slug || post._id,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Single combined endpoint — no double round-trip
        const data = await api.get('/blog/feed');
        const allBlogs = (data.posts || []).map(normalizePost);
        setBlogPosts(allBlogs);
        setCategories(['All', ...(data.categories || [])]);
        const tagsSet = new Set();
        allBlogs.forEach(blog => (blog.tags || []).forEach(tag => tagsSet.add(tag)));
        setAvailableTags(Array.from(tagsSet));
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem('edutech_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role);
      setHasPermission(user.role === 'admin' || user.role === 'instructor');
    }
  }, []);

  // Filter logic handled in-memory for responsiveness
  let filteredPosts = blogPosts.filter(blog => {
    const matchesSearch =
      searchQuery === '' ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || blog.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (selectedTag) {
    filteredPosts = filteredPosts.filter(post => post.tags && post.tags.includes(selectedTag));
  }

  // Sort logic
  if (sortBy === 'Latest') {
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === 'Popular') {
    filteredPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (sortBy === 'Trending') {
    filteredPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f8fb] to-[#e8f2f8]">
      <Helmet>
        <title>Blog | eduTech – Tech Articles &amp; Tutorials</title>
        <meta name="description" content="Read the latest tech articles, tutorials, and insights from eduTech's expert instructors and community contributors." />
        <meta property="og:title" content="Blog | eduTech" />
        <meta property="og:description" content="Tech articles, tutorials and insights from expert instructors." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://edutech-5psu.vercel.app/blog" />
      </Helmet>
      <Header />

      {/* hero */}
      <m.section
        className="py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <m.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#06213d] mb-4 sm:mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Blog – Tech Articles &amp; Tutorials
          </m.h1>
          <m.p
            className="text-lg sm:text-xl text-[#6d737a] mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            A blog about tech, real‑world tasks, and the latest news.
          </m.p>

          {/* Create Blog & Dashboard Button for Authorized Users */}
          {hasPermission && (
            <m.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mb-8 flex flex-wrap justify-center gap-4"
            >

              <Link
                to="/blog/editor"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#14627a] to-[#0f4a5b] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all group"
              >
                <PlusCircle size={20} className="group-hover:scale-110 transition-transform" /> Create New Blog
              </Link>
            </m.div>
          )}

          {/* search, sort, and tag filters */}
          <m.div
            className="max-w-4xl mx-auto mb-6 sm:mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  aria-label="Search articles"
                  placeholder="Search for articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-12 sm:pl-14 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14627a] focus:border-transparent text-sm sm:text-base"
                />
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 sm:py-4 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14627a] text-gray-700 min-w-[140px]"
              >
                <option value="Latest">Latest</option>
                <option value="Popular">Popular Views</option>
                <option value="Trending">Trending Likes</option>
              </select>

              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-3 sm:py-4 bg-white/70 backdrop-blur-sm border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#14627a] text-gray-700 min-w-[140px]"
              >
                <option value="">All Tags</option>
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </m.div>

          {/* category filter */}
          <m.div
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {categories.map((category) => (
              <m.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border-2 ${selectedCategory === category
                  ? 'bg-[#14627a] text-white border-[#14627a] shadow-lg shadow-[#14627a]/30'
                  : 'bg-white text-gray-600 border-gray-100 hover:border-[#14627a]/30 hover:bg-gray-50'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </m.button>
            ))}
          </m.div>
        </div>
      </m.section >

      {/* posts */}
      < section className="pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8" >
        <m.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14627a]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-[#14627a] text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredPosts.map((post) => (
                  <m.article
                    key={post.id}
                    variants={itemVariants}
                    className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(20,98,122,0.1)] transition-all duration-500 group border border-gray-50"
                    whileHover={{ y: -12 }}
                  >
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <m.img
                        src={getOptimizedImage(post.image, { width: 600, height: 320 })}
                        alt={post.title}
                        width="600"
                        height="320"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <m.div
                        className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-medium text-white shadow-lg ${categoryColors[post.category]}`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {post.category}
                      </m.div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-bold text-[#06213d] mb-2 sm:mb-3 line-clamp-2 group-hover:text-[#14627a] transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-[#6d737a] mb-2 sm:mb-3">
                        {post.date} • {post.readTime}
                      </p>

                      <p className="text-sm sm:text-base text-[#6d737a] mb-3 sm:mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#14627a] to-[#0d4d5e] rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                            {post.author
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-[#06213d]">
                            {post.author}
                          </span>
                        </div>

                        <Link
                          to={`/blog/${post.slug || post.id}`}
                          className="text-[#14627a] hover:text-[#0d4d5e] font-bold text-xs sm:text-sm flex items-center group/read"
                        >
                          Read more <ArrowRight size={16} className="ml-1 group-hover/read:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </m.article>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <m.div
                  className="text-center py-12 sm:py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-lg sm:text-xl text-[#6d737a]">
                    No blog posts found matching your criteria.
                  </p>
                </m.div>
              )}
            </>
          )}

          {/* New Suggestion Feature */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
          </m.div>
        </m.div>
      </section >

      <Footer />
    </div >
  );
}
