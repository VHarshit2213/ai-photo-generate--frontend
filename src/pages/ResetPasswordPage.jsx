import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';

export const ResetPasswordPage = () => {
  return (
    <div className="rounded-lg border border-white/80 bg-white/90 p-6 shadow-xl shadow-purple-100/50 backdrop-blur">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-950">Reset password</h2>
        <p className="mt-1 text-sm text-gray-600">Enter your details to set a new password</p>
      </div>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
