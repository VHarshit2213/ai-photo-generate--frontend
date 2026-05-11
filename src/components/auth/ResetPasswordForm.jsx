import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validators';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      if (!validators.email(data.email)) {
        toast.error('Invalid email format');
        return;
      }

      if (!validators.password(data.newPassword)) {
        toast.error('Password must be at least 8 characters with uppercase, lowercase, and number');
        return;
      }

      if (data.newPassword !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      await resetPassword(data.email, data.newPassword, data.resetToken);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Password reset failed');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
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

        {/* Reset Token (Optional) */}
        <div>
          <label htmlFor="resetToken" className="block text-sm font-medium text-gray-700 mb-1">
            Reset Token (Optional)
          </label>
          <input
            {...register('resetToken')}
            type="text"
            id="resetToken"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="Enter reset token if you have one"
          />
        </div>

        {/* New Password Input */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              {...register('newPassword', { required: 'New password is required' })}
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
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
          {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
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

        {/* Reset Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {/* Back to Login Link */}
        <p className="text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-purple-600 font-medium hover:text-purple-700">
            Sign in
          </Link>
        </p>
      </form>
      <Toaster />
    </>
  );
};
