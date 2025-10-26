/**
 * LoginForm - MIGRATED EXAMPLE
 *
 * This is a complete example of a form migrated to React Hook Form + Zod validation.
 * Use this as a reference pattern for migrating other forms.
 *
 * Key features:
 * - React Hook Form with zodResolver
 * - Zod validation schema with TypeScript types
 * - Reusable form components (FormInput, FormCheckbox)
 * - Proper error handling and display
 * - Accessible and HIPAA-ready
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Import validation schema and zodResolver
import { loginSchema, zodResolver, type Login } from '@/lib/validations';

// Import reusable form components
import { FormInput, FormCheckbox } from '@/components/forms';

// Import auth hook
import { useAuth } from '@/hooks/useAuth';

/**
 * LoginForm Component
 */
export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  /**
   * Form submission handler
   */
  const onSubmit = async (data: Login) => {
    try {
      setIsSubmitting(true);

      // Call login API
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe
      });

      // Success notification
      toast.success('Login successful!');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      // Error notification
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Email field */}
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        required
        error={errors.email}
        register={register}
        disabled={isSubmitting}
      />

      {/* Password field */}
      <FormInput
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        required
        error={errors.password}
        register={register}
        disabled={isSubmitting}
      />

      {/* Remember me checkbox */}
      <FormCheckbox
        name="rememberMe"
        label="Remember me for 30 days"
        register={register}
        disabled={isSubmitting}
      />

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>

      {/* Forgot password link */}
      <div className="text-sm text-center">
        <a
          href="/forgot-password"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Forgot your password?
        </a>
      </div>
    </form>
  );
};
