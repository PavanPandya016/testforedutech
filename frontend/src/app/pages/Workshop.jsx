import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import svgPaths from '../../imports/svg-go1x4xx39u';
import eventService from '../services/eventService';
import authService from '../services/authService';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// --- Helper: Auto-classify event as 'past' or 'upcoming' based on date ---
// Vibrant palette for event cards (cycles through)
const EVENT_COLORS = [
  'bg-[#14627a]',
  'bg-[#0183AB]',
  'bg-[#2e7e96]',
  'bg-[#1a5276]',
  'bg-[#117a65]',
  'bg-[#6c3483]',
  'bg-[#922b21]',
  'bg-[#7d6608]',
];

function classifyEvents(events) {
  const now = new Date();
  // Normalize today to midnight so same-day events are still "upcoming"
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return events.map((event, index) => {
    // Use startDateTime (the field the backend/model actually returns)
    const eventDate = new Date(event.startDateTime);
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    // Format a human-readable time string, e.g. "10:00 AM"
    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Location: prioritize specific address, then meeting link host, then event type
    let locationStr = event.address || event.eventType || 'Online';
    if (!event.address && event.meetingLink) {
      try {
        locationStr = new URL(event.meetingLink).hostname.replace('www.', '');
      } catch (_) {
        locationStr = 'Online';
      }
    }

    return {
      ...event,
      type: eventDay < today ? 'past' : 'upcoming',
      // Derive display month/day from startDateTime
      month: eventDate.toLocaleString('default', { month: 'short' }),
      day: String(eventDate.getDate()),
      time: timeStr,
      location: locationStr,
      // Assign a rotating vibrant background color
      bgColor: EVENT_COLORS[index % EVENT_COLORS.length],
    };
  });
}


// --- Components ---

function ArrowRightLine() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="arrow-right-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_3339)" id="arrow-right-line">
          <path d={svgPaths.p39c35b00} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3339">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function EventCard({ id, _id, month, day, title, time, location, bgColor, type, onRegister }) {
  const eventId = _id || id;
  return (
    <motion.div
      layout
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className={`${bgColor} w-full rounded-[25px] overflow-hidden shadow-lg cursor-pointer relative`}
      onClick={() => onRegister(eventId, title)}
    >
      {/* Past event overlay badge */}
      {type === 'past' && (
        <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Past
        </div>
      )}

      <div className={`p-5 sm:p-6 space-y-3 sm:space-y-4 ${type === 'past' ? 'opacity-75' : ''}`}>
        <div className="font-bold text-[36px] sm:text-[44px] md:text-[48px] text-white tracking-[0.36px]">
          <p className="leading-[1]">{month}</p>
        </div>
        <div className="font-bold text-[44px] sm:text-[52px] md:text-[55px] text-white">
          <p className="leading-[1]">{day}</p>
        </div>
        <div className="font-extrabold text-[26px] sm:text-[32px] md:text-[38px] text-white tracking-[0.08px]">
          <p className="leading-[1.1]">{title}</p>
        </div>
        <div className="flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-col">
            <span className="font-bold text-[15px] sm:text-[18px] md:text-[20px] text-white leading-[2]">
              {time}
            </span>
            <span className="font-bold text-[15px] sm:text-[18px] md:text-[20px] text-white leading-[2]">
              {location}
            </span>
          </div>
          <div className="mb-1 shrink-0">
            <ArrowRightLine />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RegistrationModal({ isOpen, onClose, eventTitle, onSubmit, isSubmitting, initialData }) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        notes: ''
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[30px] p-8 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#14627a]">Register for Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 mb-6 italic">Event: <span className="font-bold text-[#2e7e96]">{eventTitle}</span></p>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 mb-4">
            <div className="flex items-center gap-3 text-sm text-[#14627a] font-medium">
              <div className="w-8 h-8 rounded-full bg-[#14627a]/10 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Registering as</p>
                <p className="font-bold">{formData.firstName} {formData.lastName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#14627a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Registration Notes
            </label>
            <textarea
              rows="4"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#14627a]/20 focus:border-[#14627a] outline-none transition-all resize-none text-gray-700"
              placeholder="Tell us why you're interested or if you have any questions..."
            />
            <p className="text-[10px] text-gray-400 italic">These notes help us tailor the workshop to your needs.</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#14627a] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#0f4a5b] transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2 group shadow-[#14627a]/20"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Confirm Registration</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4">
              By registering, you agree to receive event-related communications at <span className="text-[#14627a] font-medium">{formData.email}</span>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function Workshop() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [registrationMessage, setRegistrationMessage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await eventService.getEvents();
        const classified = classifyEvents(data);
        setEvents(classified);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegisterClick = (eventId, eventTitle) => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    setSelectedEvent({ id: eventId, title: eventTitle });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await eventService.registerForEvent(selectedEvent.id, formData);
      setRegistrationMessage(`Successfully registered for ${selectedEvent.title}!`);
      setIsModalOpen(false);
      setTimeout(() => setRegistrationMessage(''), 4000);
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.data?.error || err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const displayed = filter === 'all' ? events : events.filter(e => e.type === filter);

  const upcomingCount = events.filter(e => e.type === 'upcoming').length;
  const pastCount = events.filter(e => e.type === 'past').length;

  return (
    <div id="main-content" className="bg-white flex flex-col min-h-screen overflow-x-hidden">
      <Helmet>
        <title>Workshops &amp; Events | eduTech – Live Learning Sessions</title>
        <meta name="description" content="Join eduTech's live workshops and events. Learn from industry experts in real-time interactive sessions on programming, design, and more." />
        <meta property="og:title" content="Workshops &amp; Events | eduTech" />
        <meta property="og:description" content="Live workshops and events from industry experts. Register today." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://edutech-5psu.vercel.app/workshop" />
      </Helmet>
      <Header />

      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e7f3f5] py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-pt-serif text-[38px] sm:text-[56px] md:text-[72px] lg:text-[80px] text-[#2e7e96] leading-tight mb-4 sm:mb-6"
          >
            Our Events
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#6d737a] leading-relaxed max-w-4xl mx-auto"
          >
            Our recent event was a great success, bringing together industry leaders and
            professionals to explore the latest trends and innovations. It featured keynote
            sessions, panel discussions, and hands-on workshops, providing valuable
            insights and networking opportunities. The event concluded with a Q&amp;A session,
            fostering meaningful discussions and collaborations.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Filter Toggle ── */}
      <div className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="inline-flex p-1.5 bg-gray-100 rounded-[20px] border border-gray-200">
            {[
              { key: 'all', label: 'All Events' },
              { key: 'upcoming', label: `Upcoming (${upcomingCount})` },
              { key: 'past', label: `Past (${pastCount})` },
            ].map(({ key, label }) => {
              const isActive = filter === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`relative px-6 sm:px-8 py-2.5 rounded-[15px] text-sm md:text-base font-semibold transition-colors duration-300 focus:outline-none ${isActive ? 'text-white' : 'text-[#6d737a] hover:text-[#14627a]'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-[#14627a] rounded-[15px] shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {registrationMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl"
          >
            {registrationMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Events Grid ── */}
      <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto min-h-[400px]">
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
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {displayed.map((event) => (
                    <EventCard
                      key={event._id || event.id}
                      {...event}
                      onRegister={handleRegisterClick}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {displayed.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-[#6d737a] text-lg mt-20"
                >
                  No events found.
                </motion.p>
              )}
            </>
          )}
        </div>
      </div>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventTitle={selectedEvent?.title}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
        initialData={currentUser}
      />

      {/* ── CTA Section ── */}


      <Footer />
    </div>
  );
}
