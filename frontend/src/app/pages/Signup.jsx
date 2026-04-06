import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import storageService from '../services/storageService';
import authService from '../services/authService';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [signupError, setSignupError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const onSubmit = async (data) => {
    setSignupError('');
    try {
      await authService.register({
        username: data.username,
        name: data.fullName,
        email: data.email,
        password: data.password,
        mobile: data.mobileNumber
      });
      
      setSubmitSuccess(true);
      
      // Determine redirect path
      const params = new URLSearchParams(location.search);
      const redirectPath = params.get('redirect') || '/';
      
      setTimeout(() => navigate(redirectPath), 1500);
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError(error.message || 'Failed to create account. Please try again.');
    }
  };

  const password = watch('password');

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

    .animate-slide-in-up {
      animation: slideInUp 0.6s ease-out forwards;
    }

    .animate-slide-in-left {
      animation: slideInLeft 0.6s ease-out forwards;
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

    .success-check {
      animation: scaleIn 0.5s ease-out;
    }
  `;

  return (
    <div className="bg-gradient-to-b from-[#f0f7fa] to-white flex flex-col min-h-screen">
      <style>{styles}</style>
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
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
                  Join eduTech
                </h1>
                <div className="w-12 h-1 bg-gradient-to-r from-[#14627a] to-[#1a9b8e] rounded-full mb-4"></div>
                <p className="font-['Public_Sans:Regular',sans-serif] font-normal text-[16px] md:text-[18px] text-[#6d737a] leading-relaxed">
                  Start your learning journey today. Sign up and get access to 5000+ courses
                </p>
              </div>

              {signupError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="font-['Public_Sans:Medium',sans-serif] text-red-700">
                    {signupError}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-scale-in">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold success-check">
                      ✓
                    </div>
                    <p className="font-['Public_Sans:Medium',sans-serif] text-green-700">
                      Account created successfully! Redirecting...
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div className="form-field">
                  <label htmlFor="fullName" className="block font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[14px] md:text-[16px] text-[#1b1d1f] mb-3">
                    <span className="text-[#d91e63]">*</span> Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    {...register('fullName', { required: 'Full name is required' })}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 ${
                      focusedField === 'fullName' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                    } ${errors.fullName ? 'border-red-500' : ''} focus:outline-none`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                {/* Username */}
                <div className="form-field">
                  <label htmlFor="username" className="block font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[14px] md:text-[16px] text-[#1b1d1f] mb-3">
                    <span className="text-[#d91e63]">*</span> Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    {...register('username', { required: 'Username is required' })}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 ${
                      focusedField === 'username' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                    } ${errors.username ? 'border-red-500' : ''} focus:outline-none`}
                    placeholder="Enter a unique username"
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div className="form-field">
                  <label htmlFor="email" className="block font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[14px] md:text-[16px] text-[#1b1d1f] mb-3">
                    <span className="text-[#d91e63]">*</span> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 ${
                      focusedField === 'email' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                    } ${errors.email ? 'border-red-500' : ''} focus:outline-none`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Mobile Number */}
                <div className="form-field">
                  <label htmlFor="mobileNumber" className="block font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[14px] md:text-[16px] text-[#1b1d1f] mb-3">
                    <span className="text-[#d91e63]">*</span> Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    {...register('mobileNumber', { 
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit mobile number'
                      }
                    })}
                    onFocus={() => setFocusedField('mobileNumber')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 ${
                      focusedField === 'mobileNumber' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                    } ${errors.mobileNumber ? 'border-red-500' : ''} focus:outline-none`}
                    placeholder="Enter your 10-digit mobile number"
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber.message}</p>}
                </div>

                {/* Password */}
                <div className="form-field">
                  <label htmlFor="password" className="block font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[14px] md:text-[16px] text-[#1b1d1f] mb-3">
                    <span className="text-[#d91e63]">*</span> Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 ${
                      focusedField === 'password' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                    } ${errors.password ? 'border-red-500' : ''} focus:outline-none`}
                    placeholder="Create a strong password (min. 6 characters)"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="form-field">
                  <label htmlFor="confirmPassword" className="block font-['Public_Sans:SemiBold',sans-serif] font-semibold text-[14px] md:text-[16px] text-[#1b1d1f] mb-3">
                    <span className="text-[#d91e63]">*</span> Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register('confirmPassword', { 
                      required: 'Confirm password is required',
                      validate: (val) => {
                        if (watch('password') !== val) {
                          return "Passwords do not match";
                        }
                      }
                    })}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 ${
                      focusedField === 'confirmPassword' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                    } ${errors.confirmPassword ? 'border-red-500' : ''} focus:outline-none`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitSuccess}
                  className="form-submit w-full bg-gradient-to-r from-[#14627a] to-[#0f4a5b] text-white px-6 py-4 rounded-xl font-['Public_Sans:SemiBold',sans-serif] text-[16px] hover:from-[#0f4a5b] hover:to-[#083a47] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg mt-8 disabled:opacity-75 cursor-pointer"
                >
                  {submitSuccess ? 'Account Created!' : 'Create Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-[#6d737a] text-sm">Already have an account?</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#6d737a]">
                  <Link to="/login" className="font-['Public_Sans:SemiBold',sans-serif] text-[#14627a] hover:text-[#0f4a5b] transition-colors hover:underline">
                    Login to your account
                  </Link>
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
