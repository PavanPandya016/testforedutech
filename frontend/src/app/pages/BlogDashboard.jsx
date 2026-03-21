import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Eye, Heart, BarChart2 } from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import blogService from '../services/blogService';

export default function BlogDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Read role correctly from the stored user object
    const userStr = localStorage.getItem('edutech_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
        setUserId(user._id || user.id);
      } catch (_) { }
    }
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // FIX: getAllBlogs is async - must be awaited
        const allBlogs = await blogService.getAllBlogs();
        setBlogs(allBlogs);
      } catch (err) {
        console.error('Error fetching blogs for dashboard:', err);
        setError('Failed to load blog posts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        // FIX: deleteBlog is async - must be awaited
        await blogService.deleteBlog(id);
        // FIX: filter by id OR _id since the API normalizePost sets id = _id || id
        setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== id));
      } catch (err) {
        console.error('Failed to delete blog:', err);
        alert('Failed to delete blog post. Please try again.');
      }
    }
  };

  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const totalLikes = blogs.reduce((sum, b) => sum + (b.likes || 0), 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Author Dashboard</h1>
            <p className="text-gray-500 mt-2">Manage your blog posts, track analytics, and write new content.</p>
          </div>
          <Link
            to="/blog/editor"
            className="inline-flex items-center justify-center gap-2 bg-[#14627a] hover:bg-[#0f4a5b] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            Write New Blog
          </Link>
        </div>

        {/* Analytics Summary */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="bg-[#14627a]/10 p-4 rounded-lg text-[#14627a]">
              <BarChart2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{isLoading ? '—' : blogs.length}</p>
            </div>
          </motion.div>




        </motion.div>

        {/* Blog Posts List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">All Articles</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#14627a]" />
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#14627a] text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 p-4 rounded-full text-gray-400">
                  <Edit className="w-8 h-8" />
                </div>
              </div>
              <p className="text-lg">No articles yet.</p>
              <p className="text-sm mt-2">Click "Write New Blog" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-sm text-gray-500 bg-gray-50/50">
                    <th className="py-4 px-6 font-medium">Post Title</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium">Date</th>
                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => {
                    const blogId = blog._id || blog.id;
                    return (
                      <motion.tr
                        key={blogId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={blog.image}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover hidden sm:block bg-gray-100"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div>
                              <Link
                                to={`/blog/${blog.slug || blogId}`}
                                className="font-semibold text-gray-900 hover:text-[#14627a] transition-colors line-clamp-1"
                              >
                                {blog.title}
                              </Link>
                              <span className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded bg-gray-100">{blog.category}</span>
                                {blog.views ? `${blog.views} views` : ''}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${blog.status === 'Published' || blog.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {blog.status || (blog.isPublished ? 'Published' : 'Draft')}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                          {blog.date}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => navigate(`/blog/${blog.slug || blogId}`)}
                              title="View"
                              className="text-gray-400 hover:text-[#14627a] transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {(userRole === 'admin' || userRole === 'instructor' || (blog.authorId && userId === blog.authorId)) && (
                              <>
                                <button
                                  onClick={() => navigate(`/blog/editor/${blog.slug || blogId}`)}
                                  title="Edit"
                                  className="text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(blogId)}
                                  title="Delete"
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
