import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  BookOpen,
  Type,
  FileText,
  Image as ImageIcon,
  Layers,
  DollarSign,
  User,
  Activity,
  Star,
  Save,
  ChevronLeft,
  X,
  Plus
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import adminService from '../services/adminService';

export default function CourseEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    excerpt: '',
    thumbnail: '',
    category: '',
    courseType: 'free',
    price: 0,
    accessType: 'enrollment',
    level: 'all',
    isActive: true,
    isFeatured: false
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch categories for the dropdown
        const cats = await adminService.getEntities('categories');
        setCategories(cats);

        if (isEditing) {
          const course = await adminService.getEntity('courses', id);
          if (course) {
            setFormData({
              title: course.title || '',
              description: course.description || '',
              excerpt: course.excerpt || '',
              thumbnail: course.thumbnail || '',
              category: course.category?._id || course.category || '',
              courseType: course.courseType || 'free',
              price: course.price || 0,
              accessType: course.accessType || 'enrollment',
              level: course.level || 'all',
              isActive: course.isActive !== undefined ? course.isActive : true,
              isFeatured: course.isFeatured || false
            });
          }
        }
      } catch (err) {
        console.error('Failed to load course data:', err);
        alert('Failed to load required data');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsSaving(true);
      try {
        const response = await adminService.uploadImage(file);
        if (response.success) {
          setFormData(prev => ({ ...prev, thumbnail: response.filepath }));
        }
      } catch (err) {
        console.error('Thumbnail upload failed:', err);
        alert('Failed to upload image');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert('Please fill in required fields (Title, Description)');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        await adminService.updateEntity('courses', id, formData);
      } else {
        await adminService.createEntity('courses', formData);
      }
      navigate('/admin');
    } catch (err) {
      console.error('Failed to save course:', err);
      alert('Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-outfit">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14627a]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-outfit">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#14627a] mb-6 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Course' : 'Create New Course'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {isEditing ? 'Modify course details and settings.' : 'Launch a new educational journey.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#14627a] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#0f4a5b] transition-all shadow-md active:scale-95 disabled:opacity-70 text-sm"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isEditing ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Type className="w-4 h-4 text-[#14627a]" /> Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Mastering Advanced React Patterns"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 outline-none transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <FileText className="w-4 h-4 text-[#14627a]" /> Single-line Excerpt
                  </label>
                  <input
                    type="text"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Short summary for the course card..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <BookOpen className="w-4 h-4 text-[#14627a]" /> Full Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="8"
                    placeholder="Detailed information about modules, outcomes, and prerequisites..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 outline-none transition-all resize-none"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Layers className="w-4 h-4 text-[#14627a]" /> Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 outline-none transition-all"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Activity className="w-4 h-4 text-[#14627a]" /> Difficulty Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 outline-none transition-all"
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <ImageIcon className="w-4 h-4 text-[#14627a]" /> Course Thumbnail
                  </label>
                  <div
                    className="relative group border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden aspect-video bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#14627a]/30 transition-all"
                    onMouseEnter={() => setIsHoveringImage(true)}
                    onMouseLeave={() => setIsHoveringImage(false)}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {formData.thumbnail ? (
                      <>
                        <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                        {isHoveringImage && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white z-0">
                            <ImageIcon className="w-8 h-8 mb-2" />
                            <span className="text-xs font-bold">Change Image</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-6 text-gray-400">
                        <Plus className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#14627a]" />
                        <p className="text-xs font-bold">Click or drag to upload</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    placeholder="Or paste image URL..."
                    className="w-full px-4 py-2 mt-2 bg-white border border-gray-100 rounded-lg text-[10px] outline-none focus:border-[#14627a]"
                  />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Pricing & Logic</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Course Type</span>
                      <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, courseType: 'free', price: 0 })}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${formData.courseType === 'free' ? 'bg-white text-[#14627a] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          Free
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, courseType: 'paid' })}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${formData.courseType === 'paid' ? 'bg-white text-[#14627a] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          Paid
                        </button>
                      </div>
                    </div>

                    {formData.courseType === 'paid' && (
                      <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                          <DollarSign className="w-3 h-3 text-[#14627a]" /> Course Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 outline-none transition-all text-sm"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3">Visibility Toggles</h3>

                  <ToggleItem
                    icon={<Activity className="w-4 h-4" />}
                    label="Active Status"
                    sub="Show to students"
                    checked={formData.isActive}
                    name="isActive"
                    onChange={handleChange}
                    color="green"
                  />

                  <ToggleItem
                    icon={<Star className="w-4 h-4" />}
                    label="Featured"
                    sub="Show on home page"
                    checked={formData.isFeatured}
                    name="isFeatured"
                    onChange={handleChange}
                    color="yellow"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ToggleItem({ icon, label, sub, checked, name, onChange, color }) {
  const colorMap = {
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600'
  };

  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${checked ? colorMap[color] : 'bg-gray-50 text-gray-400'}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-700">{label}</p>
          <p className="text-[9px] text-gray-400">{sub}</p>
        </div>
      </div>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 rounded border-gray-300 text-[#14627a] focus:ring-[#14627a]/20 cursor-pointer"
      />
    </label>
  );
}
