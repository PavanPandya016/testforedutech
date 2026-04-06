import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import storageService from '../services/storageService';
import authService from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [focusedField, setFocusedField] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (data) => {
    setLoginError('');
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password
      });

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      setSubmitSuccess(true);
      
      // Determine redirect path
      const params = new URLSearchParams(location.search);
      const redirectPath = params.get('redirect') || '/';
      
      setTimeout(() => navigate(redirectPath), 1500);
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Invalid email or password. Please try again.');
    }
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
    .form-submit { animation: slideInUp 0.6s ease-out forwards; animation-delay: 0.4s; opacity: 0; }

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
                  Welcome Back
                </h1>
                <div className="w-12 h-1 bg-gradient-to-r from-[#14627a] to-[#1a9b8e] rounded-full mb-4"></div>
                <p className="font-['Public_Sans:Regular',sans-serif] font-normal text-[16px] md:text-[18px] text-[#6d737a] leading-relaxed">
                  Login to access your courses and continue learning with eduTech
                </p>
              </div>

              {loginError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="font-['Public_Sans:Medium',sans-serif] text-red-700">
                    {loginError}
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
                      Login successful! Redirecting...
                    </p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    className={`w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 ${focusedField === 'email' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                      } ${errors.email ? 'border-red-500' : ''} focus:outline-none`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
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
                    className={`w-full px-5 py-4 border-2 rounded-xl font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#363a3d] transition-all duration-300 ${focusedField === 'password' ? 'border-[#14627a] bg-[#f0f9fc]' : 'border-[#e7e9eb] bg-white hover:border-[#14627a]/50'
                      } ${errors.password ? 'border-red-500' : ''} focus:outline-none`}
                    placeholder="Enter your password"
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="form-field flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 text-[#14627a] border-2 border-[#e7e9eb] rounded-md focus:ring-[#14627a] cursor-pointer"
                    />
                    <span className="font-['Public_Sans:Regular',sans-serif] text-[14px] text-[#6d737a]">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="font-['Public_Sans:Medium',sans-serif] text-[14px] text-[#14627a] hover:text-[#0f4a5b] transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitSuccess}
                  className="form-submit w-full bg-gradient-to-r from-[#14627a] to-[#0f4a5b] text-white px-6 py-4 rounded-xl font-['Public_Sans:SemiBold',sans-serif] text-[16px] hover:from-[#0f4a5b] hover:to-[#083a47] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg mt-8 disabled:opacity-75 cursor-pointer"
                >
                  {submitSuccess ? 'Login Successful!' : 'Login'}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-[#6d737a] text-sm">Or</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Signup Link */}
              <div className="text-center">
                <p className="font-['Public_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#6d737a]">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-['Public_Sans:SemiBold',sans-serif] text-[#14627a] hover:text-[#0f4a5b] transition-colors hover:underline">
                    Create one now
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
