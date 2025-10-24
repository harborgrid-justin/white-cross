/**
 * WF-COMP-NAV-008 | Footer.tsx - Application Footer Component
 * Purpose: Footer with links, copyright, version info
 * Dependencies: react, react-router-dom
 * Features: Responsive, dark mode support
 * Last Updated: 2025-10-24
 * Agent: NAV7L5 - React Component Architect
 */

import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

// ============================================================================
// MAIN FOOTER COMPONENT
// ============================================================================

interface FooterProps {
  className?: string
}

export const Footer = memo(({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={`
        bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700
        mt-auto
        ${className}
      `}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Section - Copyright */}
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <span>&copy; {currentYear} White Cross Healthcare Platform.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
            <span className="hidden sm:flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for student health
            </span>
          </div>

          {/* Right Section - Links */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link
              to="/help"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Help Center
            </Link>
            <Link
              to="/privacy"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-gray-400 dark:text-gray-600">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
