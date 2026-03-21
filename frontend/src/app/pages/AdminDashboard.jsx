import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, Calendar, FileText, LayoutDashboard,
  Settings, LogOut, Search, Plus, MoreVertical,
  CheckCircle, XCircle, Clock, Trash2, Edit, ExternalLink,
  BarChart3, TrendingUp, UserPlus, AlertCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import adminService from '../services/adminService';
import authService from '../services/authService';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
      ? 'bg-[#14627a] text-white shadow-md'
      : 'text-gray-600 hover:bg-gray-100'
      }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>

    </div>
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, courses: 0, events: 0, blogs: 0 });
  const [users, setUsers] = useState([]);
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
      navigate('/login');
      return;
    }

    fetchInitialData();
  }, [navigate]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const statsData = await adminService.getStats();
      setStats(statsData.stats);
      if (activeTab === 'overview') {
        // Stats are already fetched
      } else if (activeTab === 'users') {
        const usersData = await adminService.getUsers();
        setUsers(usersData);
      } else {
        const entitiesData = await adminService.getEntities(activeTab);
        setEntities(entitiesData);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [activeTab]);

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteEntity = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
      try {
        // We'll use the specific services for following logic or add generic delete to adminService
        // For now, let's assume we use adminService delete if we implement it, 
        // but we can also use the existing services.
        // I'll add a generic delete to adminService.
        await adminService.deleteEntity(type, id);
        setEntities(entities.filter(e => (e._id || e.id) !== id));
      } catch (error) {
        alert(`Failed to delete ${type.slice(0, -1)}`);
      }
    }
  };

  const handleEditEntity = (type, item) => {
    const id = item._id || item.id;
    if (type === 'blogs') {
      navigate(`/blog/editor/${id}`);
    } else {
      // For now, these might not have specialized editors yet, so we'll just alert
      alert(`Editing ${type} is not implemented yet in this UI. Please use the specialized editor if available.`);
    }
  };

  const filteredData = (activeTab === 'users' ? users : entities).filter(item => {
    const searchStr = (item.firstName || item.title || item.name || '').toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-outfit">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-200 p-6 gap-6 overflow-y-auto">
          <div className="mb-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4">Admin Menu</h2>
          </div>

          <nav className="flex flex-col gap-2">
            <SidebarItem
              icon={LayoutDashboard}
              label="Overview"
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <SidebarItem
              icon={Users}
              label="Users"
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            />
            <SidebarItem
              icon={BookOpen}
              label="Courses"
              active={activeTab === 'courses'}
              onClick={() => setActiveTab('courses')}
            />
            <SidebarItem
              icon={Calendar}
              label="Events"
              active={activeTab === 'events'}
              onClick={() => setActiveTab('events')}
            />
            <SidebarItem
              icon={FileText}
              label="Blogs"
              active={activeTab === 'blogs'}
              onClick={() => setActiveTab('blogs')}
            />
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <SidebarItem icon={Settings} label="Settings" />
            <button
              onClick={() => authService.logout().then(() => navigate('/login'))}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 capitalize">{activeTab} Management</h1>
                <p className="text-gray-500 mt-1">Manage and monitor platform activity efficiently.</p>
              </div>

              {activeTab !== 'overview' && (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] w-full sm:w-64"
                    />
                  </div>
                  <button className="bg-[#14627a] text-white p-2 rounded-lg hover:bg-[#0f4a5b] transition-colors shadow-sm">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14627a]" />
                  <p className="text-gray-500 mt-4 font-medium italic">Preparing your workspace...</p>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'overview' ? (
                    <div className="space-y-8">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                          title="Total Users"
                          value={stats.users}
                          icon={Users}
                          trend={12}
                          color="bg-blue-50 text-blue-600"
                        />
                        <StatCard
                          title="Active Courses"
                          value={stats.courses}
                          icon={BookOpen}
                          trend={5}
                          color="bg-purple-50 text-purple-600"
                        />
                        <StatCard
                          title="Upcoming Events"
                          value={stats.events}
                          icon={Calendar}
                          trend={-2}
                          color="bg-orange-50 text-orange-600"
                        />
                        <StatCard
                          title="Total Blogs"
                          value={stats.blogs}
                          icon={FileText}
                          trend={8}
                          color="bg-green-50 text-green-600"
                        />
                      </div>

                      {/* Middle Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#14627a]" /> Platform Growth
                          </h3>
                          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-400 italic">Analytical data visualization pending...</p>
                          </div>
                        </div>


                      </div>
                    </div>
                  ) : (
                    /* Table View for Users/Blogs/Courses/Events */
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {activeTab === 'users' ? 'User' : 'Title'}
                              </th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {activeTab === 'users' ? 'Role' : 'Author/Instructor'}
                              </th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {filteredData.map((item) => (
                              <tr key={item._id} className="hover:bg-[#f8fafc]/50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#14627a]/10 flex items-center justify-center text-[#14627a] font-bold text-sm">
                                      {(item.firstName || item.title || item.name || 'E').charAt(0)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-900 line-clamp-1">
                                        {activeTab === 'users' ? `${item.firstName} ${item.lastName}` : (item.title || item.name)}
                                      </p>
                                      {activeTab === 'users' && <p className="text-xs text-gray-500">{item.email}</p>}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm font-medium text-gray-600 capitalize">
                                    {activeTab === 'users' ? (item.role || 'User') : (item.author?.firstName || item.instructor?.firstName || 'System')}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${(item.isActive !== false && item.status !== 'Draft') ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="text-sm font-medium text-gray-700">
                                      {item.status || (item.isActive !== false ? 'Active' : 'Inactive')}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleEditEntity(activeTab, item)}
                                      className="p-2 text-gray-400 hover:text-[#14627a] hover:bg-[#14627a]/10 rounded-lg transition-all"
                                      title="Edit"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => activeTab === 'users' ? handleDeleteUser(item._id) : handleDeleteEntity(activeTab, item._id || item.id)}
                                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all" title="View">
                                      <ExternalLink className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {filteredData.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                          <Search className="w-12 h-12 text-gray-200 mb-4" />
                          <p className="font-medium">No results found matching your search.</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
