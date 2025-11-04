/**
 * @fileoverview Profile header component with avatar and quick info
 * @module app/(dashboard)/profile/_components/ProfileHeader
 * @category Profile - Components
 */

'use client';

import { Camera, Briefcase, Award, Calendar, Clock, Edit3, Download } from 'lucide-react';
import type { UserProfile } from '@/lib/actions/profile.actions';

interface ProfileHeaderProps {
  profile: UserProfile;
  onAvatarUpload?: () => void;
  onEditProfile?: () => void;
  onExportData?: () => void;
}

/**
 * Profile header component
 * Displays user avatar, basic info, and quick action buttons
 *
 * @component
 * @example
 * ```tsx
 * <ProfileHeader
 *   profile={userProfile}
 *   onAvatarUpload={handleAvatarUpload}
 *   onEditProfile={handleEdit}
 *   onExportData={handleExport}
 * />
 * ```
 */
export function ProfileHeader({
  profile,
  onAvatarUpload,
  onEditProfile,
  onExportData
}: ProfileHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          {/* Profile Image */}
          <div className="relative">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </div>
            )}
            {onAvatarUpload && (
              <button
                onClick={onAvatarUpload}
                title="Upload profile picture"
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border hover:bg-gray-50 transition-colors"
                aria-label="Upload profile picture"
              >
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-lg text-gray-600 mt-1">{profile.title}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="h-4 w-4" />
                {profile.department}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                ID: {profile.employeeId}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                Hired: {formatDate(profile.hireDate)}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Last login: {formatDateTime(profile.lastLogin)}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          {onEditProfile && (
            <button
              onClick={onEditProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="h-4 w-4 mr-2 inline" />
              Edit Profile
            </button>
          )}
          {onExportData && (
            <button
              onClick={onExportData}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2 inline" />
              Export Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
