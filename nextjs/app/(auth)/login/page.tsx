'use client';

/**
 * Login Page - Next.js App Router
 *
 * Migrated from frontend/src/pages/auth/Login.tsx
 *
 * Features:
 * - Secure authentication with HIPAA compliance
 * - Remember me functionality
 * - Password reset integration
 * - Session management
 * - Audit logging
 *
 * @remarks
 * This is a Client Component because it uses:
 * - useState for form data
 * - useRouter for navigation
 * - Authentication context
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

// Import components from existing codebase
import { LoginForm } from '@/pages-old/auth/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, user } = useAuth();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = searchParams.get('from') || '/dashboard';
      router.replace(from);
    }
  }, [user, router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(loginData.email, loginData.password, loginData.rememberMe);

      const from = searchParams.get('from') || '/dashboard';
      router.replace(from);

      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            White Cross Healthcare
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <LoginForm
          loginData={loginData}
          loading={isLoading}
          onSubmit={handleLogin}
          onInputChange={handleInputChange}
        />

        {/* Footer - HIPAA Compliance Notice */}
        <div className="text-center text-sm text-gray-600">
          <p>
            <span className="font-semibold">HIPAA Compliant</span> • Secure Connection •
            Protected Health Information (PHI)
          </p>
          <p className="mt-1 text-xs">
            All data is encrypted and stored securely in compliance with HIPAA regulations
          </p>
        </div>
      </div>
    </div>
  );
}
