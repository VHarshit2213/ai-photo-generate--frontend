import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validators';
import { Loader2, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const handlePasswordChange = (value) => {
    if (value) {
      setPasswordStrength(validators.passwordStrength(value));
    } else {
      setPasswordStrength(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!validators.email(data.email)) {
        toast.error('Invalid email format');
        return;
      }

      if (!validators.password(data.password)) {
        toast.error('Password must be at least 8 characters with uppercase, lowercase, and number');
        return;
      }

      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (!validators.name(data.name)) {
        toast.error('Full name must be at least 2 characters');
        return;
      }

      await registerUser(data.email, data.password, data.name);
      toast.success('Registration successful!');
      navigate('/generate');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
        {/* Full Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            {...register('name', { required: 'Full name is required' })}
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password', { 
                required: 'Password is required',
                onChange: (e) => handlePasswordChange(e.target.value)
              })}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          
          {/* Password Strength Indicator */}
          {passwordStrength && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all ${
                        i < passwordStrength.score
                          ? passwordStrength.score <= 2
                            ? 'bg-red-500'
                            : passwordStrength.score <= 3
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-600">{passwordStrength.level}</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            {...register('confirmPassword', { required: 'Please confirm your password' })}
            type="password"
            id="confirmPassword"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 font-medium hover:text-purple-700">
            Sign in
          </Link>
        </p>
      </form>
      <Toaster />
    </>
  );
};
