declare module "*.jsx" {
  import type { ComponentType, ReactNode } from "react";

  export const AuthProvider: ComponentType<{ children: ReactNode }>;
  export const ProtectedRoute: ComponentType<{ children: ReactNode }>;
  export const Navbar: ComponentType;
  export const LoginPage: ComponentType;
  export const RegisterPage: ComponentType;
  export const ResetPasswordPage: ComponentType;
  export const GeneratorPage: ComponentType;
  export const GalleryPage: ComponentType;
  export const ProfilePage: ComponentType;

  const DefaultComponent: ComponentType;
  export default DefaultComponent;
}

declare module "*.js" {
  export const useAuth: () => {
    user: unknown;
    loading: boolean;
    error: unknown;
    login: (...args: unknown[]) => Promise<unknown>;
    register: (...args: unknown[]) => Promise<unknown>;
    logout: () => void;
    resetPassword: (...args: unknown[]) => Promise<unknown>;
    isAuthenticated: boolean;
  };
}
