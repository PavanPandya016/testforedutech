import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { Edit, Trash2, ChevronRight } from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import blogService from "../services/blogService";

// Blog Components
import TableOfContents from '../components/blog/TableOfContents';
import AuthorBio from '../components/blog/AuthorBio';
import KeepReadingCard from '../components/blog/KeepReadingCard';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [keepReading, setKeepReading] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Framer motion variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('edutech_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role);
      setUserId(user._id || user.id);
    }
  }, []);

  const { toc, blogContent } = useMemo(() => {
    if (!blog || !blog.content) return { toc: [], blogContent: '' };

    let finalContent = blog.content;
    let tocItems = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(finalContent, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');

    headings.forEach((heading, index) => {
      const sectionId = `section-${index}`;
      heading.id = sectionId;
      tocItems.push({
        id: sectionId,
        title: heading.textContent,
        level: heading.tagName.toLowerCase()
      });
    });

    return { toc: tocItems, blogContent: doc.body.innerHTML };
  }, [blog]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const post = await blogService.getBlogBySlug(id);
        if (post) {
          setBlog(post);

          // Fetch dynamic suggestions for "Keep Reading"
          const allBlogs = await blogService.getAllBlogs();
          const otherBlogs = allBlogs.filter(b => b.id !== post.id);
          const recentPosts = [...otherBlogs]
            .sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date))
            .slice(0, 3);
          setKeepReading(recentPosts);
        }
      } catch (err) {
        console.error('Failed to load blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('.custom-blog-content h2, .custom-blog-content h3');
      let currentSection = null;

      headings.forEach((heading) => {
        const top = heading.getBoundingClientRect().top;
        if (top < 150) { // Offset for header
          currentSection = heading.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14627a]"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Not Found</h2>
          <p className="text-gray-600 mb-8">The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="bg-[#14627a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0f4a5b] transition-all">
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await blogService.deleteBlog(blog.slug || blog._id || blog.id);
        navigate('/blog/dashboard');
      } catch (err) {
        console.error('Failed to delete blog:', err);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const authorInitials = blog.author.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="bg-gradient-to-b from-[#f4f8fb] to-white min-h-screen">
      <Header />

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

        {/* Admin/Instructor Actions - only shown to authorized users */}
        {(userRole === 'admin' || userRole === 'instructor' || (blog.authorId && userId === blog.authorId)) && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex gap-4 justify-end"
          >
            <Link
              to={`/blog/editor/${id}`}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#14627a] text-[#14627a] rounded-lg font-semibold hover:bg-[#14627a]/5 transition-all shadow-sm"
            >
              <Edit size={18} /> Edit Post
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-all shadow-sm"
            >
              <Trash2 size={18} /> Delete Post
            </button>
          </m.div>
        )}

        {/* Blog Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-[880px] mx-auto text-center mb-10 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            <span className="px-3 py-1 bg-[#14627a]/10 text-[#14627a] text-sm font-semibold rounded-full border border-[#14627a]/20">
              {blog.category}
            </span>
            {blog.tags && blog.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="font-['Public_Sans:SemiBold',sans-serif] text-4xl sm:text-5xl lg:text-6xl text-[#06213d] mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-[#4a5565] text-sm sm:text-base font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#14627a] to-[#0d4d5e] rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md">
                {authorInitials}
              </div>
              <span className="text-[#06213d]">{blog.author}</span>
            </div>
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            <span>{blog.date}</span>
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            <span>{blog.readTime}</span>
          </div>
        </m.div>

        {/* Hero Image */}
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 sm:mb-16 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5 max-w-[1000px] mx-auto"
        >
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-auto max-h-[600px] object-cover"
          />
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 max-w-[1000px] mx-auto">
          {/* Table of Contents Sidbar */}
          <div className="hidden lg:block lg:col-span-3">
            <TableOfContents toc={toc} activeSection={activeSection} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {/* Excerpt */}
            {blog.excerpt && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="bg-[#f0f9fc]/50 border-l-4 border-[#14627a] p-6 sm:p-8 rounded-r-xl mb-12"
              >
                <p className="text-xl sm:text-2xl text-[#14627a] font-medium leading-relaxed italic">
                  "{blog.excerpt}"
                </p>
              </m.div>
            )}

            {/* Blog Content */}
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 prose prose-lg sm:prose-xl max-w-none text-[#364153] 
                         prose-headings:text-[#06213d] prose-headings:font-bold prose-a:text-[#14627a] 
                         prose-img:rounded-xl prose-img:shadow-md
                         prose-blockquote:border-[#14627a] prose-blockquote:bg-gray-50 prose-blockquote:not-italic prose-blockquote:py-2
                         custom-blog-content"
            >
              <style dangerouslySetInnerHTML={{
                __html: `
                .custom-blog-content h2 { margin-top: 3rem; margin-bottom: 1.5rem; scroll-margin-top: 6rem; font-size: 1.875rem; color: #06213d; }
                .custom-blog-content h3 { margin-top: 2rem; margin-bottom: 1rem; scroll-margin-top: 6rem; font-size: 1.5rem; color: #06213d; }
                .custom-blog-content p { margin-bottom: 1.5rem; line-height: 1.8; }
                .custom-blog-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
                html { scroll-behavior: smooth; }
              `}} />
              <div dangerouslySetInnerHTML={{ __html: blogContent }}></div>
            </m.div>
            {/* Author Bio Section */}
            <AuthorBio author={blog.author} category={blog.category} />
          </div>
        </div>

        {/* Keep Reading Section */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="mb-16"
        >
          <m.h2
            variants={fadeInUp}
            className="font-['Merriweather:Bold',sans-serif] text-3xl sm:text-4xl text-[#101828] mb-8 sm:mb-12"
          >
            Keep reading
          </m.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {keepReading.map((article) => (
              <KeepReadingCard key={article.id} article={article} />
            ))}
          </div>
        </m.div>
      </main>

      <Footer />
    </div>
  );
}
