import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { authAPI } from '../api/auth';
import { Loader2, LogOut, User } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const onSubmitProfile = async (data) => {
    try {
      setUpdatingProfile(true);
      await authAPI.updateProfile(data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      navigate('/login');
      toast.success('Account deleted!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile Settings</h1>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                {...register('name', { required: 'Full name is required' })}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {updatingProfile && <Loader2 size={18} className="animate-spin" />}
              {updatingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Actions</h2>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            <LogOut size={18} /> Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Delete Account
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ProfilePage;
