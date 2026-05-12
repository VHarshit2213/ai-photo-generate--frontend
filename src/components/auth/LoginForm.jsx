import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validators';
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      if (!validators.email(data.email)) {
        toast.error('Invalid email format');
        return;
      }

      await login(data.email, data.password);
      toast.success('Login successful!');
      navigate('/generate');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="w-full space-y-4">
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
            <div className="mb-3 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-900">
                Password
              </label>
              <Link to="/reset-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
              <input
                {...register('password', { required: 'Password is required' })}
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
          </div>
        </div>

        <div className="w-full space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-neutral-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </form>
      <Toaster />
    </>
  );
};
