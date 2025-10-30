/**
 * @fileoverview Home Page Hero Section Component
 * 
 * Hero section component for the homepage featuring the main value proposition
 * and call-to-action for unauthenticated users.
 * 
 * @module components/pages/HomePage/HeroSection
 * @since 1.0.0
 */

'use client';

import Link from 'next/link';
import { useAppSelector } from '@/stores/hooks';

/**
 * Hero Section Component
 * 
 * Renders the main hero section with title, description, and conditional CTA.
 */
export function HeroSection() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Enterprise Healthcare Platform
        </h2>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive school nurse platform for managing student health records, 
          medications, and emergency communications with HIPAA compliance.
        </p>
        
        {!isAuthenticated && (
          <div className="mt-8">
            <Link
              href="/login"
              className="healthcare-button-primary text-lg px-8 py-3"
            >
              Access Platform
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
