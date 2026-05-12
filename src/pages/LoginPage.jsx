import { LoginForm } from '../components/auth/LoginForm';
import AuthLayout from '../components/auth/AuthLayout';
import { RightContent } from '../components/auth/LayoutRightContent';


export const LoginPage = () => {
  return (
    <AuthLayout rightContent={<RightContent title="Welcome back to Taxtail" desc="Create stunning poster images with AI-powered generation" />}>
      <div className="rounded-[1.75rem] border border-white/85 bg-white p-7 shadow-[0_22px_60px_rgba(90,107,90,0.2)] sm:p-10">
        <div className="mb-8">
          <h2 className="mb-2 font-display text-3xl font-bold text-neutral-900">Sign In</h2>
          <p className="text-neutral-600">Welcome back to your account</p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
