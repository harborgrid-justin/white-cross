/**
 * Footer Component - Application footer
 *
 * Features:
 * - HIPAA compliance notice
 * - Copyright information
 * - Version display
 * - Responsive layout
 * - Dark mode support
 */

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          {/* Left section - Copyright and compliance */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} White Cross Healthcare. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              HIPAA Compliant Healthcare Platform
            </p>
          </div>

          {/* Right section - Links */}
          <div className="mt-4 md:mt-0">
            <nav className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/support"
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                Support
              </Link>
              <span className="text-sm text-gray-400 dark:text-gray-500">
                v1.0.0
              </span>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
