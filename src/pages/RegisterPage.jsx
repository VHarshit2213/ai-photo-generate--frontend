import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage = () => {
  return (
    <div className="rounded-lg overflow-auto border border-white/80 bg-white/90 p-6 shadow-xl shadow-purple-100/50 backdrop-blur">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-950">Create account</h2>
        <p className="mt-1 text-sm text-gray-600">Join to start generating fashion images</p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
