import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Link,
  Users,
  Save,
  X,
  Image as ImageIcon,
  Type,
  FileText,
  Video,
  CheckCircle,
  Star,
  ChevronLeft,
  MapPin
} from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import adminService from '../services/adminService';

export default function EventEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'webinar',
    thumbnail: '',
    startDateTime: '',
    endDateTime: '',
    meetingLink: '',
    address: '',
    maxParticipants: '',
    isActive: true,
    isFeatured: false
  });

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (isEditing) {
        try {
          const event = await adminService.getEntity('events', id);
          if (event) {
            // Format dates for datetime-local input (YYYY-MM-DDThh:mm)
            const startDate = event.startDateTime ? new Date(event.startDateTime).toISOString().slice(0, 16) : '';
            const endDate = event.endDateTime ? new Date(event.endDateTime).toISOString().slice(0, 16) : '';

            setFormData({
              title: event.title || '',
              description: event.description || '',
              eventType: event.eventType || 'webinar',
              thumbnail: event.thumbnail || '',
              startDateTime: startDate,
              endDateTime: endDate,
              meetingLink: event.meetingLink || '',
              address: event.address || '',
              maxParticipants: event.maxParticipants || '',
              isActive: event.isActive !== undefined ? event.isActive : true,
              isFeatured: event.isFeatured || false
            });
          }
        } catch (err) {
          console.error('Failed to load event:', err);
          alert('Failed to load event data');
          navigate('/admin');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchEvent();
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

    // Basic validation
    if (!formData.title || !formData.description || !formData.startDateTime || !formData.endDateTime) {
      alert('Please fill in all required fields (Title, Description, Start & End Date)');
      return;
    }

    setIsSaving(true);
    try {
      const dataToSave = {
        ...formData,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined
      };

      if (isEditing) {
        await adminService.updateEntity('events', id, dataToSave);
      } else {
        await adminService.createEntity('events', dataToSave);
      }

      navigate('/admin');
    } catch (err) {
      console.error('Failed to save event:', err);
      alert('Failed to save event. Please check all fields.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
        {/* Breadcrumbs */}
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#14627a] mb-6 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Event' : 'Create New Event'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Fill in the details below to {isEditing ? 'update the' : 'host a new'} event.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin')}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#14627a] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#0f4a5b] transition-all shadow-md active:scale-95 disabled:opacity-70 text-sm"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isEditing ? 'Update Event' : 'Publish Event'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Title */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Type className="w-4 h-4 text-[#14627a]" /> Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a catchy title for the event..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] outline-none transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <FileText className="w-4 h-4 text-[#14627a]" /> Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Detailed information about the event, topics, speakers, etc..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] outline-none transition-all resize-none"
                    required
                  ></textarea>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Calendar className="w-4 h-4 text-[#14627a]" /> Start Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="startDateTime"
                      value={formData.startDateTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Clock className="w-4 h-4 text-[#14627a]" /> End Date & Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="endDateTime"
                      value={formData.endDateTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Full-width Address for physical events */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <MapPin className="w-4 h-4 text-[#14627a]" /> Event Address (Physical Location)
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter the physical venue or location details..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] outline-none transition-all"
                  />
                  <p className="text-[10px] text-gray-400 italic font-medium pl-1">Leave empty for virtual events</p>
                </div>

                {/* Links & Capacity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Video className="w-4 h-4 text-[#14627a]" /> Meeting Link (Zoom/GMeet)
                    </label>
                    <input
                      type="url"
                      name="meetingLink"
                      value={formData.meetingLink}
                      onChange={handleChange}
                      placeholder="https://zoom.us/j/..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Users className="w-4 h-4 text-[#14627a]" /> Max Participants
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      placeholder="e.g., 100"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Status & Settings */}
              <div className="space-y-8">
                {/* Thumbnail */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <ImageIcon className="w-4 h-4 text-[#14627a]" /> Event Thumbnail
                  </label>
                  <div
                    className="relative group border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden aspect-video bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all"
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
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white z-0 animate-in fade-in duration-200">
                            <ImageIcon className="w-8 h-8 mb-2" />
                            <span className="text-xs font-bold">Change Image</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-6 text-gray-400">
                        <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <span className="text-xs font-bold uppercase tracking-wider">Upload Thumbnail</span>
                        <p className="text-[10px] mt-1">Recommended size: 1280x720</p>
                      </div>
                    )}
                  </div>
                  {/* Manual URL input as backup */}
                  <input
                    type="text"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    placeholder="Or paste image URL here..."
                    className="w-full px-4 py-2 mt-2 bg-white border border-gray-100 rounded-lg text-xs focus:ring-1 focus:ring-[#14627a]/20 outline-none"
                  />
                </div>

                {/* Event Type */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <ListIcon className="w-4 h-4 text-[#14627a]" /> Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] outline-none transition-all"
                  >
                    <option value="webinar">Webinar</option>
                    <option value="seminar">Seminar</option>
                    <option value="workshop">Workshop</option>
                    <option value="conference">Conference</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="p-6 bg-white border border-gray-100 rounded-2xl space-y-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3 mb-4">Display & Status</h3>

                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${formData.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-700">Active Status</p>
                        <p className="text-[10px] text-gray-400">Visibile to public</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-[#14627a] focus:ring-[#14627a]/20"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${formData.isFeatured ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-400'}`}>
                        <Star className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-700">Featured Event</p>
                        <p className="text-[10px] text-gray-400">Show in featured section</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-[#14627a] focus:ring-[#14627a]/20"
                    />
                  </label>
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

const ListIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);
