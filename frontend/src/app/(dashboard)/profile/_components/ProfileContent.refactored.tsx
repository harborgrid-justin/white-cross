/**
 * @fileoverview Profile Content Component - Refactored with sub-components
 * @module app/(dashboard)/profile/_components/ProfileContent
 * @category Profile - Components
 */

'use client';

import { useState } from 'react';
import {
  getCurrentUserProfile,
  enableTwoFactorAction,
  disableTwoFactorAction,
  type UserProfile
} from '@/lib/actions/profile.actions';

// Import custom hooks
import { useProfileData, useProfileUpdate } from './hooks';

// Import UI components
import { LoadingState, ErrorState } from './ui';

// Import feature components
import { ProfileHeader } from './ProfileHeader';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ContactInfoForm } from './ContactInfoForm';
import { EmergencyContactForm } from './EmergencyContactForm';
import { SecuritySettings } from './SecuritySettings';
import { CertificationsPanel } from './CertificationsPanel';
import { ActivityLog } from './ActivityLog';
import { PreferencesPanel } from './PreferencesPanel';

interface ProfileContentProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * Main profile content component
 * Orchestrates all profile sub-components and manages data flow
 *
 * @component
 * @example
 * ```tsx
 * <ProfileContent searchParams={{}} />
 * ```
 */
export function ProfileContent({ }: ProfileContentProps) {
  // Load profile data using custom hook
  const {
    profile,
    loading,
    error,
    refetchProfile,
    updateProfile: setProfile
  } = useProfileData();

  // Profile update hook
  const { updateProfile: updateProfileAction, updating } = useProfileUpdate();

  // Local error state for operations
  const [operationError, setOperationError] = useState<string | null>(null);

  // Handle profile field updates
  const handleProfileSave = async (data: Partial<UserProfile>) => {
    if (!profile) return;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    const updatedProfile = await updateProfileAction(profile.userId, formData);
    if (updatedProfile) {
      setProfile(updatedProfile);
      setOperationError(null);
    }
  };

  // Handle 2FA toggle
  const handleTwoFactorToggle = async () => {
    if (!profile) return;

    try {
      const result = profile.security.twoFactorEnabled
        ? await disableTwoFactorAction(profile.userId)
        : await enableTwoFactorAction(profile.userId);

      if (result.success) {
        // Reload profile to get updated 2FA status
        const updatedProfile = await getCurrentUserProfile();
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
        setOperationError(null);
      } else {
        setOperationError(result.error || 'Failed to update two-factor authentication');
      }
    } catch (err) {
      setOperationError('Failed to update two-factor authentication. Please try again.');
    }
  };

  // Handle password change
  const handlePasswordChange = async (
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    // Password change is handled by the SecuritySettings component
    // This is just a placeholder for the prop
    return true;
  };

  // Handle preferences save
  const handlePreferencesSave = async (preferences: Partial<UserProfile['preferences']>) => {
    await handleProfileSave({ preferences: { ...profile?.preferences, ...preferences } as any });
  };

  // Handle avatar upload
  const handleAvatarUpload = () => {
    // TODO: Implement avatar upload modal
    console.log('Avatar upload clicked');
  };

  // Handle data export
  const handleExportData = () => {
    // TODO: Implement data export
    console.log('Export data clicked');
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error && !profile) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  // No profile state
  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Operation Error Display */}
      {operationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {operationError}
        </div>
      )}

      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        onAvatarUpload={handleAvatarUpload}
        onExportData={handleExportData}
      />

      {/* Two-column grid for forms */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <PersonalInfoForm
          profile={profile}
          onSave={handleProfileSave}
          disabled={updating}
        />

        {/* Contact Information */}
        <ContactInfoForm
          profile={profile}
          onSave={handleProfileSave}
          disabled={updating}
        />

        {/* Emergency Contact */}
        <EmergencyContactForm
          profile={profile}
          onSave={handleProfileSave}
          disabled={updating}
        />

        {/* Security Settings */}
        <SecuritySettings
          profile={profile}
          onToggleTwoFactor={handleTwoFactorToggle}
          onPasswordChange={handlePasswordChange}
          disabled={updating}
        />
      </div>

      {/* Certifications */}
      <CertificationsPanel
        profile={profile}
        onUpload={() => console.log('Upload certificate')}
        onView={(id) => console.log('View certificate:', id)}
        onDownload={(id) => console.log('Download certificate:', id)}
        onDelete={(id) => console.log('Delete certificate:', id)}
      />

      {/* Recent Activity */}
      <ActivityLog
        profile={profile}
        onExport={() => console.log('Export activity')}
        onViewAll={() => console.log('View all activity')}
      />

      {/* Preferences */}
      <PreferencesPanel
        profile={profile}
        onSave={handlePreferencesSave}
        disabled={updating}
      />
    </div>
  );
}
