import { RegisterForm } from '../components/auth/RegisterForm';
import AuthLayout from '../components/auth/AuthLayout';
import { RightContent } from '../components/auth/LayoutRightContent';


export const RegisterPage = () => {
  return (
    <AuthLayout rightContent={<RightContent title="Start creating with Image generation" desc="Turn ideas into polished AI-generated poster images in minutes" />}>
      <div className="rounded-[1.75rem] border border-white/85 bg-white p-7 shadow-[0_22px_60px_rgba(90,107,90,0.2)] sm:p-10">
        <div className="mb-8">
          <h2 className="mb-2 font-display text-3xl font-bold text-neutral-900">Create Account</h2>
          <p className="text-neutral-600">Join to start generating poster images</p>
        </div>
        <RegisterForm />
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
