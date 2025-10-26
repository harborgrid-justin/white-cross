'use client';

/**
 * Access Denied Page - Next.js App Router
 *
 * Migrated from frontend/src/pages/auth/AccessDenied.tsx
 *
 * Displayed when a user tries to access a resource they don't have permission for.
 *
 * @remarks
 * This is a Client Component because it uses useRouter for navigation.
 */

import { useRouter } from 'next/navigation';
import { AccessDeniedContent } from '@/pages-old/auth/components/AccessDeniedContent';

export default function AccessDeniedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <AccessDeniedContent
        onGoBack={handleGoBack}
        onGoToDashboard={handleGoToDashboard}
      />
    </div>
  );
}
