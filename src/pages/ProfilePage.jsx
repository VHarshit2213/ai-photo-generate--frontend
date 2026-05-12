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
    },
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent-olive" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold text-neutral-900">Profile Settings</h1>

        <div className="surface-card mb-6 p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent-olive bg-gradient-primary shadow-button">
              <User className="h-8 w-8 text-neutral-900" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900">{user?.name}</h2>
              <p className="text-neutral-700">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="surface-card mb-6 p-8">
          <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Edit Profile</h2>
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Full Name</label>
              <input {...register('name', { required: 'Full name is required' })} type="text" className="field-control" />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Email</label>
              <input {...register('email', { required: 'Email is required' })} type="email" className="field-control" />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={updatingProfile} className="btn-primary w-full">
              {updatingProfile && <Loader2 size={18} className="animate-spin" />}
              {updatingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="surface-card space-y-4 p-8">
          <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Account Actions</h2>

          <button onClick={handleLogout} className="btn-secondary w-full">
            <LogOut size={18} /> Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
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
