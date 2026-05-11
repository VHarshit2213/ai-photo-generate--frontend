import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
    return (
        <div className="rounded-lg border border-white/80 bg-white/90 p-6 shadow-xl shadow-purple-100/50 backdrop-blur">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-950">Welcome back</h2>
                <p className="mt-1 text-sm text-gray-600">Sign in to your account</p>
            </div>
            <LoginForm />
        </div>
    );
};

export default LoginPage;
