import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function Apply() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    educationLevel: '',
    course: ''
  });

  const [focusedField, setFocusedField] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dummy course data - will be replaced with API call
  const courses = [
    { id: 1, name: 'Web Development' },
    { id: 2, name: 'IoT (Internet of Things)' },
    { id: 3, name: 'Game Development' },
    { id: 4, name: 'Machine Learning' },
    { id: 5, name: 'Mobile App Development' },
    { id: 6, name: 'Cloud Computing' }
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store application data in localStorage
    localStorage.setItem('applicantName', formData.name);
    localStorage.setItem('applicantEmail', formData.email);
    localStorage.setItem('applicantPhone', formData.phoneNumber);
    localStorage.setItem('applicantEducation', formData.educationLevel);
    localStorage.setItem('applicantCourse', formData.course);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('userRole', 'student');
    localStorage.setItem('userName', formData.name);
    
    setSubmitSuccess(true);
    setTimeout(() => navigate('/'), 1500);
  };

  const styles = `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }

    .animate-slide-in-up {
      animation: slideInUp 0.6s ease-out forwards;
    }

    .animate-fade-in {
      animation: fadeIn 0.6s ease-out forwards;
    }

    .animate-slide-in-left {
      animation: slideInLeft 0.6s ease-out forwards;
    }

    .animate-scale-in {
      animation: scaleIn 0.5s ease-out forwards;
    }

    .form-field {
      animation: slideInUp 0.6s ease-out forwards;
    }

    .form-field:nth-child(1) { animation-delay: 0.1s; opacity: 0; }
    .form-field:nth-child(2) { animation-delay: 0.2s; opacity: 0; }
    .form-field:nth-child(3) { animation-delay: 0.3s; opacity: 0; }
    .form-field:nth-child(4) { animation-delay: 0.4s; opacity: 0; }
    .form-field:nth-child(5) { animation-delay: 0.5s; opacity: 0; }
    .form-submit { animation: slideInUp 0.6s ease-out forwards; animation-delay: 0.6s; opacity: 0; }

    .form-input:focus {
      box-shadow: 0 0 0 3px rgba(20, 98, 122, 0.1);
    }

    .success-check {
      animation: scaleIn 0.5s ease-out;
    }
  `;

  return (
    <div className="bg-gradient-to-b from-[#f0f7fa] to-white flex flex-col min-h-screen">
      <style>{styles}</style>
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          {/* Form Container with Gradient Background */}
          <div className="relative">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#14627a]/5 to-[#1a9b8e]/5 rounded-3xl blur-xl opacity-60"></div>
            
            {/* Main Form Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-[#e0f2f7] overflow-hidden">
              {/* Decorative top border accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14627a] via-[#1a9b8e] to-[#14627a]"></div>

              {/* Header Section */}
              <div className="mb-10 animate-slide-in-left">
                <h1 className="font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[32px] md:text-[44px] text-[#14627a] leading-tight mb-4">
                  Course Application
                </h1>
                <div className="w-12 h-1 bg-gradient-to-r from-[#14627a] to-[#1a9b8e] rounded-full mb-4"></div>
                <p className="font-['Public_Sans:Regular',sans-serif] font-normal text-[16px] md:text-[18px] text-[#6d737a] leading-relaxed">
                  Take the first step towards your learning journey. Fill out the form below to apply for your desired course.
                </p>
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-scale-in">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold success-check">
                      ✓
                    </div>
                    <p className="font-['Public_Sans:Medium',sans-serif] text-green-700">
                      Application submitted successfully! Redirecting...
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="form-field">
                  <label htmlFor="name" className="block font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[14px] md:text-[16px] text-[#1b1d1f] mb-3">
                    <span className="text-[#d91e63]">*</span> Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`form-input w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 ${
                      focusedField === 'name' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                    } focus:outline-none`}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="form-field">
                  <label htmlFor="email" className="block font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[14px] md:text-[16px] text-[#1b1d1f] mb-3">
                    <span className="text-[#d91e63]">*</span> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`form-input w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 ${
                      focusedField === 'email' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                    } focus:outline-none`}
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone Number */}
                <div className="form-field">
                  <label htmlFor="phoneNumber" className="block font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[14px] md:text-[16px] text-[#1b1d1f] mb-3">
                    <span className="text-[#d91e63]">*</span> Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phoneNumber')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`form-input w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 ${
                      focusedField === 'phoneNumber' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                    } focus:outline-none`}
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Education Level */}
                <div className="form-field">
                  <label htmlFor="educationLevel" className="block font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[14px] md:text-[16px] text-[#1b1d1f] mb-3">
                    <span className="text-[#d91e63]">*</span> Education Level
                  </label>
                  <select
                    id="educationLevel"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('educationLevel')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`form-input w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 appearance-none bg-white cursor-pointer ${
                      focusedField === 'educationLevel' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                    } focus:outline-none`}
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2314627a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">Select your education level</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Course Selection */}
                <div className="form-field">
                  <label htmlFor="course" className="block font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[14px] md:text-[16px] text-[#1b1d1f] mb-3">
                    <span className="text-[#d91e63]">*</span> Select Course
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('course')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className={`form-input w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 appearance-none bg-white cursor-pointer ${
                      focusedField === 'course' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                    } focus:outline-none`}
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2314627a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">Choose a course to apply</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitSuccess}
                  className="form-submit w-full bg-gradient-to-r from-[#14627a] to-[#0f4a5b] text-white px-6 py-4 rounded-xl font-['Public_Sans:SemiBold',sans-serif] text-[16px] hover:from-[#0f4a5b] hover:to-[#083a47] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg mt-8 disabled:opacity-75 cursor-pointer"
                >
                  {submitSuccess ? 'Application Submitted!' : 'Submit Application'}
                </button>
              </form>

              {/* Info Box */}
              <div className="mt-8 p-5 bg-gradient-to-r from-[#14627a]/5 to-[#1a9b8e]/5 border border-[#14627a]/20 rounded-xl">
                <p className="font-['Public_Sans:Regular',sans-serif] text-[13px] md:text-[14px] text-[#6d737a]">
                  ℹ️ Please fill out all fields accurately. Your application will be reviewed within 2-3 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
