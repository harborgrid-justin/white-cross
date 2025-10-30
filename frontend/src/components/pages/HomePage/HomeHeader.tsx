/**
 * @fileoverview Home Page Header Component
 * 
 * Reusable header component for the homepage that handles authentication-aware navigation.
 * Displays different content based on user authentication state.
 * 
 * @module components/pages/HomePage/HomeHeader
 * @since 1.0.0
 */

'use client';

import { useAppSelector } from '@/stores/hooks';
import Link from 'next/link';

interface HomeHeaderProps {
  mounted: boolean;
}

/**
 * Home Header Component
 * 
 * Renders the homepage header with conditional navigation based on authentication state.
 * 
 * @param props.mounted - Whether the component has been mounted (prevents hydration mismatch)
 */
export function HomeHeader({ mounted }: HomeHeaderProps) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">
                White Cross Healthcare
              </h1>
            </div>
          </div>
          <nav className="flex items-center space-x-4" suppressHydrationWarning>
            {mounted && (isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user?.firstName} {user?.lastName}
                </span>
                <Link
                  href="/dashboard"
                  className="healthcare-button-primary"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="healthcare-button-primary"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
