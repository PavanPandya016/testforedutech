import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, Calendar, FileText, LayoutDashboard,
  Settings, LogOut, Search, Plus, MoreVertical,
  CheckCircle, XCircle, Clock, Trash2, Edit, ExternalLink,
  BarChart3, TrendingUp, UserPlus, AlertCircle, Star, Save, Image as ImageIcon,
  Tag, UserCog
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
  const [stats, setStats] = useState({ users: 0, courses: 0, events: 0, blogs: 0, instructors: 0 });
  const [users, setUsers] = useState([]);
  const [entities, setEntities] = useState([]);
  const [siteSettings, setSiteSettings] = useState({ heroImages: [], featuredCourseIds: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isParticipantsLoading, setIsParticipantsLoading] = useState(false);
  const [isAddingInstructor, setIsAddingInstructor] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [newInstructor, setNewInstructor] = useState({ name: '', studyArea: '', img: '' });

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
      } else if (activeTab === 'settings') {
        const settingsData = await adminService.getSiteSettings();
        setSiteSettings(settingsData || { heroImages: [], featuredCourseIds: [] });
      } else {
        const url = `/admin/entities/list/${activeTab}`;
        // window.alert(`Fetching URL: http://localhost:5000/api${url}`); // Uncomment if needed, but console.log is safer
        console.log(`[AdminDashboard] Fetching entities for tab: ${activeTab} from ${url}`);
        const response = await adminService.getEntities(activeTab, true);
        console.log(`[AdminDashboard] Response for ${activeTab}:`, response);
        setEntities(response.data || []);
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
        await adminService.deleteEntity(type, id);
        setEntities(entities.filter(e => (e._id || e.id) !== id));
      } catch (error) {
        alert(`Failed to delete ${type.slice(0, -1)}`);
      }
    }
  };

  const handleToggleFeatured = async (course) => {
    try {
      // Toggle logic using isFeatured
      const newStatus = !course.isFeatured;
      await adminService.updateEntity('courses', course._id || course.id, {
        isFeatured: newStatus
      });
      setEntities(entities.map(e =>
        (e._id === course._id || e.id === course.id) ? { ...e, isFeatured: newStatus } : e
      ));
    } catch (error) {
      console.error('Failed to update featured status:', error);
      alert('Failed to update featured status');
    }
  };

  const handleUpdateSettings = async (e) => {
    e && e.preventDefault();
    try {
      await adminService.updateSiteSettings(siteSettings);
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings');
    }
  };

  const [uploadingIndex, setUploadingIndex] = useState(null);

  const handleFileUpload = async (file, type, index = null) => {
    if (!file) return;

    const uploadKey = type === 'hero' ? `hero-${index}` : 'cta';
    setUploadingIndex(uploadKey);
    try {
      const response = await adminService.uploadImage(file);
      if (response.success) {
        if (type === 'hero') {
          handleHeroImageChange(index, response.filepath);
        } else if (type === 'cta') {
          handleCtaImageChange(response.filepath);
        } else if (type === 'instructor') {
          handleUpdateInstructor(index, { img: response.filepath });
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleHeroImageChange = (index, value) => {
    const newImages = [...(siteSettings.heroImages || [])];
    newImages[index] = value;
    setSiteSettings({ ...siteSettings, heroImages: newImages });
  };

  const handleCtaImageChange = (value) => {
    setSiteSettings({ ...siteSettings, ctaImage: value });
  };

  const handleEditEntity = (type, item) => {
    const id = item._id || item.id;
    if (type === 'blogs') {
      navigate(`/blog/editor/${id}`);
    } else if (type === 'events') {
      navigate(`/admin/events/edit/${id}`);
    } else if (type === 'courses') {
      navigate(`/admin/courses/edit/${id}`);
    } else if (type === 'instructors') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsAddingInstructor(true);
      setEditingInstructor(item);
      setNewInstructor({ name: item.name, studyArea: item.studyArea, img: item.img });
    } else if (type === 'categories') {
      const newName = prompt('Enter new category name:', item.name);
      if (newName && newName !== item.name) {
        handleUpdateCategory(id, newName);
      }
    } else {
      alert(`Editing ${type} is not implemented yet.`);
    }
  };

  const handleCreateInstructor = async (data) => {
    try {
      if (editingInstructor) {
        await adminService.updateEntity('instructors', editingInstructor._id, data || newInstructor);
      } else {
        await adminService.createEntity('instructors', data || newInstructor);
      }
      fetchInitialData();
      setIsAddingInstructor(false);
      setEditingInstructor(null);
      setNewInstructor({ name: '', studyArea: '', img: '' });
    } catch (error) {
      console.error('Failed to save instructor:', error);
      alert('Failed to save instructor');
    }
  };

  const handleUpdateInstructor = async (id, data) => {
    try {
      await adminService.updateEntity('instructors', id, data);
      fetchInitialData();
    } catch (error) {
      console.error('Failed to update instructor:', error);
      alert('Failed to update instructor');
    }
  };

  const handleCreateCategory = async (name) => {
    try {
      await adminService.createEntity('categories', { name });
      fetchInitialData();
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to create category: ' + (error.response?.data?.error || error.response?.data?.message || error.message));
    }
  };

  const handleUpdateCategory = async (id, name) => {
    try {
      await adminService.updateEntity('categories', id, { name });
      fetchInitialData();
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Failed to update category: ' + (error.response?.data?.error || error.response?.data?.message || error.message));
    }
  };

  const handleViewParticipants = async (event) => {
    setSelectedEvent(event);
    setIsParticipantsModalOpen(true);
    setIsParticipantsLoading(true);
    try {
      const data = await adminService.getEventParticipants(event._id || event.id);
      setParticipants(data);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
      alert('Failed to load participants');
    } finally {
      setIsParticipantsLoading(false);
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
            <SidebarItem
              icon={Tag}
              label="Categories"
              active={activeTab === 'categories'}
              onClick={() => setActiveTab('categories')}
            />
            <SidebarItem
              icon={UserCog}
              label="Instructors"
              active={activeTab === 'instructors'}
              onClick={() => setActiveTab('instructors')}
            />
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <SidebarItem
              icon={Settings}
              label="Settings"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
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
                  <button
                    onClick={() => {
                      if (activeTab === 'events') navigate('/admin/events/new');
                      else if (activeTab === 'blogs') navigate('/blog/editor');
                      else if (activeTab === 'courses') navigate('/admin/courses/new');
                      else if (activeTab === 'categories') {
                        const name = prompt('Enter new category name:');
                        if (name) handleCreateCategory(name);
                      }
                      else if (activeTab === 'instructors') {
                        setIsAddingInstructor(!isAddingInstructor);
                      }
                      else alert(`Creating ${activeTab} is not implemented yet.`);
                    }}
                    className="bg-[#14627a] text-white p-2 rounded-lg hover:bg-[#0f4a5b] transition-colors shadow-sm"
                  >
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
                  {activeTab === 'instructors' && isAddingInstructor && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 bg-white p-6 rounded-2xl border border-[#14627a]/20 shadow-sm"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-[#14627a]/10 rounded-lg text-[#14627a]">
                          <UserPlus className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-gray-900">{editingInstructor ? 'Edit' : 'Add New'} Instructor</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Instructor Name"
                          value={newInstructor.name}
                          onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#14627a]/20 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Study Area (e.g. Web Design)"
                          value={newInstructor.studyArea}
                          onChange={(e) => setNewInstructor({ ...newInstructor, studyArea: e.target.value })}
                          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#14627a]/20 outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Image URL or upload ->"
                            value={newInstructor.img}
                            onChange={(e) => setNewInstructor({ ...newInstructor, img: e.target.value })}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#14627a]/20 outline-none"
                          />
                          <label className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                            <ImageIcon className="w-5 h-5 text-gray-600" />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  try {
                                    const res = await adminService.uploadImage(file);
                                    if (res.success) setNewInstructor({ ...newInstructor, img: res.filepath });
                                  } catch (err) {
                                    alert('Upload failed');
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => {
                            setIsAddingInstructor(false);
                            setEditingInstructor(null);
                            setNewInstructor({ name: '', studyArea: '', img: '' });
                          }}
                          className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleCreateInstructor()}
                          className="px-6 py-2 bg-[#14627a] text-white rounded-lg font-bold hover:bg-[#0f4a5b] transition-all"
                        >
                          {editingInstructor ? 'Update' : 'Save'} Instructor
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'settings' ? (
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
                      <div className="mb-8 border-b border-gray-100 pb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <ImageIcon className="w-6 h-6 text-[#14627a]" /> Hero Section Configuration
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">Update the primary visuals seen by all visitors on the landing page.</p>
                      </div>

                      <div className="space-y-8">
                        {[0, 1].map((index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hero Image {index + 1} URL</label>
                                <label className="cursor-pointer bg-[#14627a]/10 text-[#14627a] hover:bg-[#14627a]/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                                  {uploadingIndex === `hero-${index}` ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-[#14627a]" />
                                  ) : (
                                    <Save className="w-3 h-3" />
                                  )}
                                  Upload from Machine
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e.target.files[0], 'hero', index)}
                                    disabled={uploadingIndex !== null}
                                  />
                                </label>
                              </div>
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  value={(siteSettings?.heroImages?.[index]) || ''}
                                  onChange={(e) => handleHeroImageChange(index, e.target.value)}
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 outline-none text-sm"
                                  placeholder="https://images.unsplash.com/..."
                                />
                              </div>
                              <p className="text-[10px] text-gray-400 italic">Recommended size: 500x500 pixels (Square)</p>
                            </div>
                            <div className="relative group border-2 border-dashed border-gray-100 rounded-2xl overflow-hidden aspect-video bg-gray-50">
                              {uploadingIndex === `hero-${index}` ? (
                                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#14627a]" />
                                  <span className="text-xs font-bold text-[#14627a] animate-pulse">Uploading to Cloudinary...</span>
                                </div>
                              ) : null}
                              {siteSettings?.heroImages?.[index] ? (
                                <img src={siteSettings.heroImages[index]} alt={`Hero ${index + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                  <span className="text-xs font-medium">No preview available</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* CTA Section Configuration */}
                      <div className="mt-12 pt-12 border-t border-gray-100">
                        <div className="mb-8 pb-6">
                          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <LayoutDashboard className="w-6 h-6 text-[#14627a]" /> CTA Section Configuration
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">Manage the image and messaging for the bottom Call to Action section.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">CTA Section Image URL</label>
                              <label className="cursor-pointer bg-[#14627a]/10 text-[#14627a] hover:bg-[#14627a]/20 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                                {uploadingIndex === 'cta' ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-[#14627a]" />
                                ) : (
                                  <Save className="w-3 h-3" />
                                )}
                                Upload from Machine
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e.target.files[0], 'cta')}
                                  disabled={uploadingIndex !== null}
                                />
                              </label>
                            </div>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={siteSettings?.ctaImage || ''}
                                onChange={(e) => handleCtaImageChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 outline-none text-sm"
                                placeholder="https://images.unsplash.com/..."
                              />
                            </div>
                            <p className="text-[10px] text-gray-400 italic">Recommended size: 500x500 pixels (Square)</p>
                          </div>
                          <div className="relative group border-2 border-dashed border-gray-100 rounded-2xl overflow-hidden aspect-video bg-gray-50">
                            {uploadingIndex === 'cta' ? (
                              <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#14627a]" />
                                <span className="text-xs font-bold text-[#14627a] animate-pulse">Uploading to Cloudinary...</span>
                              </div>
                            ) : null}
                            {siteSettings?.ctaImage ? (
                              <img src={siteSettings.ctaImage} alt="CTA Section" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-xs font-medium">No preview available</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 flex justify-end pt-8 border-t border-gray-50">
                        <button
                          onClick={handleUpdateSettings}
                          className="flex items-center gap-2 bg-[#14627a] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#0f4a5b] transition-all shadow-lg hover:shadow-[#14627a]/25 transform active:scale-95"
                        >
                          <Save className="w-5 h-5" /> Save Platform Settings
                        </button>
                      </div>
                    </div>
                  ) : activeTab === 'overview' ? (
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
                        <StatCard
                          title="Instructors"
                          value={stats.instructors || 0}
                          icon={UserCog}
                          trend={0}
                          color="bg-red-50 text-red-600"
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
                                {activeTab === 'users' ? 'User' : activeTab === 'instructors' ? 'Instructor' : 'Title'}
                              </th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {activeTab === 'users' ? 'Role' : activeTab === 'instructors' ? 'Study Area' : 'Category / Author'}
                              </th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                              {activeTab === 'courses' && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Featured</th>}
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {filteredData.map((item) => (
                              <tr key={item._id} className="hover:bg-[#f8fafc]/50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#14627a]/10 flex items-center justify-center text-[#14627a] font-bold text-sm overflow-hidden relative group/img">
                                      {activeTab === 'instructors' && item.img ? (
                                        <>
                                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity">
                                            <ImageIcon className="w-4 h-4 text-white" />
                                            <input
                                              type="file"
                                              className="hidden"
                                              accept="image/*"
                                              onChange={(e) => handleFileUpload(e.target.files[0], 'instructor', item._id || item.id)}
                                            />
                                          </label>
                                        </>
                                      ) : (
                                        (item.firstName || item.title || item.name || 'E').charAt(0)
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-900 line-clamp-1">
                                      {activeTab === 'users' ? `${item.firstName} ${item.lastName}` : (item.title || item.name || 'Unnamed')}
                                      </p>
                                      {activeTab === 'users' && <p className="text-xs text-gray-500">{item.email}</p>}
                                      {activeTab === 'categories' && <p className="text-xs text-gray-500">slug: {item.slug}</p>}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm font-medium text-gray-600 capitalize">
                                    {activeTab === 'users' ? (item.role || 'User') : activeTab === 'instructors' ? (item.studyArea || 'General') : (
                                      <div className="flex flex-col">
                                        <span className="text-gray-900 font-medium">{(activeTab === 'courses' ? item.category?.name : '') || ''}</span>
                                        <span className="text-xs text-gray-500">{item.author?.firstName || item.instructor?.firstName || 'System'}</span>
                                      </div>
                                    )}
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
                                {activeTab === 'courses' && (
                                  <td className="px-6 py-4">
                                    <button
                                      onClick={() => handleToggleFeatured(item)}
                                      className={`p-2 rounded-lg transition-colors ${item.isFeatured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:bg-gray-100'}`}
                                      title={item.isFeatured ? 'Remove from Home' : 'Feature on Home'}
                                    >
                                      <Star className={`w-5 h-5 ${item.isFeatured ? 'fill-current' : ''}`} />
                                    </button>
                                  </td>
                                )}
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-2">
                                    {activeTab === 'events' && (
                                      <button
                                        onClick={() => handleViewParticipants(item)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        title="View Participants"
                                      >
                                        <Users className="w-4 h-4" />
                                      </button>
                                    )}
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

      {/* Participants Modal */}
      <AnimatePresence>
        {isParticipantsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[30px] p-8 max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#14627a]">Event Participants</h2>
                  <p className="text-gray-500 text-sm">Registered users for: <span className="font-semibold text-gray-900">{selectedEvent?.title}</span></p>
                </div>
                <button
                  onClick={() => setIsParticipantsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-[300px]">
                {isParticipantsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#14627a]" />
                  </div>
                ) : participants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Users className="w-12 h-12 mb-2 opacity-20" />
                    <p>No participants registered yet.</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100/50 border-b border-gray-100">
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Registered At</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {participants.map((reg) => (
                          <tr key={reg._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#14627a]/10 flex items-center justify-center text-[#14627a] font-bold text-xs uppercase">
                                  {reg.user?.firstName?.charAt(0) || 'U'}
                                </div>
                                <span className="text-sm font-bold text-gray-900">
                                  {reg.user ? `${reg.user.firstName} ${reg.user.lastName}` : 'Deleted User'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-900">{reg.user?.email}</span>
                                <span className="text-xs text-gray-500">{reg.user?.phone || 'No phone'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(reg.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs text-gray-500 italic max-w-xs truncate" title={reg.notes}>
                                {reg.notes || 'No notes'}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsParticipantsModalOpen(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}