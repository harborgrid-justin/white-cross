/**
 * @fileoverview Profile Dashboard Page - User profile management interface
 * @module app/(dashboard)/profile/page
 * @category Profile - Pages
 */

import { Metadata } from 'next';
import { ProfileContent } from './_components/ProfileContent';

/**
 * Metadata for the profile dashboard page
 */
export const metadata: Metadata = {
  title: 'My Profile | White Cross Healthcare',
  description: 'Manage your user profile, account settings, security preferences, and personal information for the White Cross Healthcare platform.',
  keywords: [
    'user profile',
    'account settings',
    'personal information',
    'security settings',
    'profile management',
    'healthcare platform',
    'preferences'
  ]
};

/**
 * Profile Dashboard Page Component
 * 
 * Main profile management interface providing comprehensive user account management including:
 * - Personal information and contact details
 * - Security settings and two-factor authentication
 * - Notification preferences and display settings  
 * - Professional certifications and licenses
 * - Recent account activity and audit logs
 * - Privacy settings and data management
 * 
 * @returns Server component with profile dashboard content
 */
interface ProfilePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProfilePage({ searchParams }: ProfilePageProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings, security preferences, and personal information
          </p>
        </div>
        
        {/* Profile Status Indicators */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Profile Complete
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Verified Account
          </div>
        </div>
      </div>

      {/* Main Profile Content */}
      <ProfileContent searchParams={searchParams} />

      {/* Footer Information */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg border">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Account Status: Active</span>
            <span>•</span>
            <span>Member Since: August 2021</span>
            <span>•</span>
            <span>Profile Score: 85%</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy: Secure</span>
            <span>•</span>
            <span>2FA: Enabled</span>
            <span>•</span>
            <span className="text-green-600 font-medium">Verified Healthcare Professional</span>
          </div>
        </div>
      </div>
    </div>
  );
}
