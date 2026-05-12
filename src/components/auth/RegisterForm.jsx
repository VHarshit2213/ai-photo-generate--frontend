import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validators';
import { Loader2, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const strengthColor = (score) => {
  if (score <= 1) return 'text-red-500';
  if (score === 2) return 'text-orange-500';
  if (score === 3) return 'text-yellow-500';
  return 'text-primary-600';
};

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handlePasswordChange = (value) => {
    setPasswordStrength(value ? validators.passwordStrength(value) : null);
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
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="w-full space-y-4">
          <div>
            <label htmlFor="name" className="mb-3 block text-sm font-semibold text-neutral-900">
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
              <input
                {...register('name', { required: 'Full name is required' })}
                type="text"
                id="name"
                disabled={loading}
                className="w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 py-3 pl-12 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-600 focus:border-primary-500 focus:bg-accent-yellow focus:bg-opacity-10 focus:shadow-focus"
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-3 block text-sm font-semibold text-neutral-900">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                id="email"
                disabled={loading}
                className="w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 py-3 pl-12 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-600 focus:border-primary-500 focus:bg-accent-yellow focus:bg-opacity-10 focus:shadow-focus"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-3 block text-sm font-semibold text-neutral-900">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
              <input
                {...register('password', {
                  required: 'Password is required',
                  onChange: (e) => handlePasswordChange(e.target.value),
                })}
                type={showPassword ? 'text' : 'password'}
                id="password"
                disabled={loading}
                className="w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 py-3 pl-12 pr-12 text-neutral-900 outline-none transition-all placeholder:text-neutral-600 focus:border-primary-500 focus:bg-accent-yellow focus:bg-opacity-10 focus:shadow-focus"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}

            {passwordStrength && (
              <div className="flex items-center justify-end gap-2 mt-2">
                <span className={`text-xs font-semibold ${strengthColor(passwordStrength.score)}`}>{passwordStrength.level}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-3 block text-sm font-semibold text-neutral-900">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
              <input
                {...register('confirmPassword', { required: 'Please confirm your password' })}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                disabled={loading}
                className="w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 py-3 pl-12 pr-12 text-neutral-900 outline-none transition-all placeholder:text-neutral-600 focus:border-primary-500 focus:bg-accent-yellow focus:bg-opacity-10 focus:shadow-focus"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="w-full space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </form>
      <Toaster />
    </>
  );
};
