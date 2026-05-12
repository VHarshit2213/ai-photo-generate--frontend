import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { CalendarDays, Loader2, LogOut, Mail, Pencil, ShieldCheck, Sparkles, Trash2, User } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { getInitial, getProfileImageUrl } from '../utils/profileImage';

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const maxImageSize = 5 * 1024 * 1024;

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, loading, updateProfile } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState();
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
    });
  }, [reset, user]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const profileImage = avatarPreview || getProfileImageUrl(user);
  const showProfileImage = profileImage && !avatarLoadError;

  useEffect(() => {
    setAvatarLoadError(false);
  }, [profileImage]);

  const onSubmitProfile = async (data) => {
    try {
      setUpdatingProfile(true);
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const openAvatarPicker = () => {
    if (!uploadingAvatar) avatarInputRef.current?.click();
  };

  const clearSelectedAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview('');
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const uploadAvatar = async (file) => {
    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      if (user?.name) formData.append('name', user.name);
      if (user?.email) formData.append('email', user.email);
      formData.append('profileImg', file);

      await updateProfile(formData);
      clearSelectedAvatar();
      toast.success('Profile image updated');
    } catch (err) {
      clearSelectedAvatar();
      toast.error(err.message || 'Failed to upload profile image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      toast.error('Please select a JPG, PNG, or WEBP image');
      event.target.value = '';
      return;
    }

    if (file.size > maxImageSize) {
      toast.error('Profile image must be 5MB or smaller');
      event.target.value = '';
      return;
    }

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    uploadAvatar(file);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      navigate('/login');
      toast.success('Account deleted');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-200" />
      </div>
    );
  }

  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active account';
  const stats = [
    { label: 'Plan', value: user?.plan || 'Creator', icon: Sparkles },
    { label: 'Status', value: user?.isVerified ? 'Verified' : 'Active', icon: ShieldCheck },
    { label: 'Joined', value: joinedDate, icon: CalendarDays },
  ];

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-lg border border-white/20 bg-white p-6 text-black shadow-card backdrop-blur-xl">

          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-primary-700">
            <Sparkles size={15} /> Account
          </p>
          <h1 className="mb-2 text-4xl font-bold">Profile settings</h1>
          <p className="max-w-2xl text-neutral-600">Manage your identity, account details, and session preferences.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="surface-card overflow-hidden">
            <div className="bg-gradient-primary p-8 text-white">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={openAvatarPicker}
                    className="group relative grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border border-white/30 bg-white/95 text-4xl font-bold text-primary-700 shadow-2xl transition hover:scale-[1.02]"
                    aria-label="Update profile image"
                  >
                    {showProfileImage ? (
                      <img
                        src={profileImage}
                        alt={user?.name || 'Profile avatar'}
                        className="h-full w-full object-cover"
                        onError={() => setAvatarLoadError(true)}
                      />
                    ) : (
                      getInitial(user)
                    )}
                    <span className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full border border-white/70 bg-white text-primary-700 shadow-lg transition group-hover:scale-105">
                      {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                    </span>
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="sr-only"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="min-w-0">
                  <p className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-50">
                    Creator profile
                  </p>
                  <h2 className="truncate text-3xl font-bold">{user?.name || 'Guest User'}</h2>
                  <p className="mt-1 truncate text-primary-100">{user?.email || 'No email available'}</p>
                </div>
              </div>
            </div>


            <div className="grid gap-3 p-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-lg border border-primary-100 bg-primary-50/70 p-4">
                  <Icon className="mb-3 h-5 w-5 text-primary-600" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
                  <p className="mt-1 truncate font-semibold text-neutral-900">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Edit profile</h2>
              <p className="mt-1 text-sm text-neutral-600">Keep your account details current.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700">Full name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-500" />
                  <input {...register('name', { required: 'Full name is required' })} type="text" className="field-control pl-12" />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-500" />
                  <input {...register('email', { required: 'Email is required' })} type="email" className="field-control pl-12" />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <button type="submit" disabled={updatingProfile} className="btn-primary w-full">
                {updatingProfile && <Loader2 size={18} className="animate-spin" />}
                {updatingProfile ? 'Saving changes...' : 'Save changes'}
              </button>
            </form>
          </section>
        </div>

        <section className="surface-card mt-6 p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">Account actions</h2>
              <p className="mt-1 text-sm text-neutral-600">Control your session or remove local access.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={handleLogout} className="btn-secondary">
                <LogOut size={18} /> Logout
              </button>

              <button
                onClick={handleDeleteAccount}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700 transition hover:bg-red-100"
              >
                <Trash2 size={18} /> Delete account
              </button>
            </div>
          </div>
        </section>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default ProfilePage;
