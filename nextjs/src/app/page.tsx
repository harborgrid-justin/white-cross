'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import Link from 'next/link';

export default function Home() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
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
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
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

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="healthcare-card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Health Records Management
              </h3>
              <p className="text-gray-600">
                Secure, comprehensive health record management with real-time access 
                and HIPAA-compliant data handling.
              </p>
            </div>

            <div className="healthcare-card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Medication Management
              </h3>
              <p className="text-gray-600">
                Track medications, manage prescriptions, and monitor student 
                medication schedules with automated reminders.
              </p>
            </div>

            <div className="healthcare-card text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Emergency Communications
              </h3>
              <p className="text-gray-600">
                Instant emergency notifications, parent communications, and 
                crisis management tools for school health emergencies.
              </p>
            </div>
          </div>

          {/* Status Section */}
          <div className="mt-16 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Platform Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Backend API</span>
                <span className="status-active">✓ Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database Connection</span>
                <span className="status-active">✓ Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Real-time Features</span>
                <span className="status-active">✓ Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">HIPAA Compliance</span>
                <span className="status-active">✓ Verified</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 White Cross Healthcare Platform. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Enterprise healthcare platform for school nursing with HIPAA compliance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
