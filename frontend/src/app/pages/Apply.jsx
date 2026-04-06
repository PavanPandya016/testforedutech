import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import authService from '../services/authService';
import applicationService from '../services/applicationService';

export default function Apply() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    educationLevel: '',
    course: '',
    note: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  // Authentication and Data Prefill
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          // If not logged in, redirect to login and preserve the current application details (like course)
          const currentUrl = location.pathname + location.search;
          navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
          return;
        }

        // Try to get fresh profile data from backend to ensure all fields like 'phone' are there
        let profile = user;
        try {
          const response = await authService.getProfile();
          if (response && response.user) {
            profile = response.user;
          }
        } catch (err) {
          console.warn('Failed to fetch fresh profile, using cached data');
        }
        
        // Extract course from URL if available
        const params = new URLSearchParams(location.search);
        const courseParam = params.get('course') || '';

        setFormData(prev => ({
          ...prev,
          name: profile.name || 
                (profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : '') || 
                profile.firstName || 
                profile.username || 
                'User',
          email: profile.email || '',
          phoneNumber: profile.phone || profile.mobile || profile.mobileNumber || profile.phoneNumber || 'Not Provided',
          course: courseParam || 'No Course Selected'
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, location.search]);

  const educationLevels = [
    'High School',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await applicationService.submitApplication({
        courseTitle: formData.course,
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        educationLevel: formData.educationLevel,
        note: formData.note
      });
      setSubmitSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slideInUp 0.5s ease-out forwards; }
    
    .form-input:focus {
      box-shadow: 0 0 0 3px rgba(20, 98, 122, 0.1);
      border-color: #14627a;
    }
    .form-input {
      transition: all 0.2s ease-in-out;
    }
    .read-only-input {
      background-color: #f8fafb;
      border-color: #e2e8f0;
      color: #64748b;
      cursor: not-allowed;
    }
  `;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#14627a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f7fa]/30 flex flex-col min-h-screen font-outfit">
      <style>{styles}</style>
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-xl border border-[#e0f2f7] overflow-hidden animate-slide-up">
          {/* Top colored bar */}
          <div className="h-2.5 bg-[#14627a]"></div>

          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h1 className="text-[32px] md:text-[40px] font-bold text-[#14627a] mb-2">
                Course Application
              </h1>
              <p className="text-[#64748b] text-[16px] md:text-[18px]">
                Start your transformation today. Tell us a bit about your background.
              </p>
            </div>

            {submitSuccess && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-pulse">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                <p className="text-green-700 font-medium">Application submitted successfully! Redirecting you home...</p>
              </div>
            )}

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Locked Information Section */}
              <div className="space-y-6">
                <h3 className="text-[#14627a] font-bold text-sm tracking-widest uppercase">
                  YOUR INFORMATION (LOCKED)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[14px] font-semibold text-[#334155]">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      readOnly
                      className="w-full px-4 py-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafb] text-[#64748b] font-medium cursor-not-allowed outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[14px] font-semibold text-[#334155]">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-4 py-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafb] text-[#64748b] font-medium cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[14px] font-semibold text-[#334155]">Contact Number</label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      readOnly
                      className="w-full px-4 py-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafb] text-[#64748b] font-medium cursor-not-allowed outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[14px] font-semibold text-[#334155]">Selected Course</label>
                    <input
                      type="text"
                      value={formData.course}
                      readOnly
                      className="w-full px-4 py-3.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafb] text-[#64748b] font-medium cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100"></div>

              {/* Editable Section */}
              <div className="space-y-6">
                <h3 className="text-[#14627a] font-bold text-sm tracking-widest uppercase">
                  APPLICATION DETAILS
                </h3>
                
                <div className="space-y-2">
                  <label htmlFor="educationLevel" className="block text-[14px] font-semibold text-[#334155]">
                    <span className="text-[#de3b40] mr-1">*</span>Highest Education Level
                  </label>
                  <div className="relative">
                    <select
                      id="educationLevel"
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      required
                      className="form-input w-full px-4 py-3.5 rounded-xl border border-[#e2e8f0] bg-white text-[#1e293b] font-medium outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Level</option>
                      {educationLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="note" className="block text-[14px] font-semibold text-[#334155]">
                    Application Note (Optional)
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows="4"
                    className="form-input w-full px-4 py-3.5 rounded-xl border border-[#e2e8f0] bg-white text-[#1e293b] font-medium outline-none resize-none"
                    placeholder="Share your goals or any specific questions you have for the instructor..."
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitSuccess}
                className="w-full bg-[#14627a] text-white py-4 rounded-xl font-bold text-[18px] hover:bg-[#0f4a5b] transition-all transform hover:scale-[1.01] active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitSuccess ? 'Application Sent!' : 'Complete Application'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

