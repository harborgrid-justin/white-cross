/**
 * @fileoverview Profile Content Component - Orchestrator for modular profile components
 * @module app/(dashboard)/profile/_components/ProfileContent
 * @category Profile - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

// Import server actions
import { 
  getCurrentUserProfile, 
  getProfileSettings,
  getSecurityLogs,
  getActiveSessions,
  updateProfileFromForm,
  changePasswordFromForm,
  uploadAvatarAction,
  enableTwoFactorAction,
  disableTwoFactorAction,
  type UserProfile,
  type ProfileSettings,
  type SecurityLog,
  type ActiveSession
} from '@/lib/actions/profile.actions';

// Import modular components
import { ProfileHeader } from './ProfileHeader';
import { PersonalInformation } from './PersonalInformation';
import { ContactInformation } from './ContactInformation';
import { EmergencyContact } from './EmergencyContact';
import { SecuritySettings } from './SecuritySettings';
import { Certifications } from './Certifications';
import { RecentActivity } from './RecentActivity';
import { Preferences } from './Preferences';

interface ProfileContentProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function ProfileContent({ }: ProfileContentProps) {
  // Profile data state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Loading states for different operations
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all profile data concurrently
        const [profileData, settingsData, logsData, sessionsData] = await Promise.all([
          getCurrentUserProfile(),
          getProfileSettings('current'),
          getSecurityLogs('current', 10),
          getActiveSessions('current')
        ]);

        setProfile(profileData);
        setSettings(settingsData);
        setSecurityLogs(logsData);
        setSessions(sessionsData);
      } catch (err) {
        console.error('Failed to load profile data:', err);
        setError('Failed to load profile data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Handler functions for child components
  const handleEditProfile = () => {
    // Open edit mode or navigate to edit page
    console.log('Edit profile clicked');
  };

  const handleUploadAvatar = async (file: File) => {
    if (!profile) return;
    
    try {
      setIsUploadingAvatar(true);
      const result = await uploadAvatarAction(profile.userId, file);
      
      if (result.success && result.data) {
        setProfile(prev => prev ? { ...prev, profileImage: result.data.profileImage } : null);
      } else {
        setError(result.error || 'Failed to upload avatar');
      }
    } catch (err) {
      setError('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleExportData = async () => {
    // Implement data export functionality
    console.log('Export data clicked');
  };

  const handleUpdatePersonalInfo = async (info: Partial<{ 
    firstName: string; 
    lastName: string; 
    title: string; 
    department: string; 
  }>) => {
    if (!profile) return;
    
    try {
      setIsUpdatingProfile(true);
      const formData = new FormData();
      Object.entries(info).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      const result = await updateProfileFromForm(profile.userId, formData);
      
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        setError(result.error || 'Failed to update personal information');
      }
    } catch (err) {
      setError('Failed to update personal information. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdateContact = async (contactData: {
    email: string;
    phone: string;
    address: { street: string; city: string; state: string; zipCode: string };
  }) => {
    if (!profile) return;
    
    try {
      setIsUpdatingProfile(true);
      const formData = new FormData();
      formData.append('email', contactData.email);
      formData.append('phone', contactData.phone);
      formData.append('address', JSON.stringify(contactData.address));
      
      const result = await updateProfileFromForm(profile.userId, formData);
      
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        setError(result.error || 'Failed to update contact information');
      }
    } catch (err) {
      setError('Failed to update contact information. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdateEmergencyContact = async (contactData: {
    name: string;
    relationship: string;
    phone: string;
  }) => {
    if (!profile) return;
    
    try {
      setIsUpdatingProfile(true);
      const formData = new FormData();
      formData.append('emergencyContact', JSON.stringify(contactData));
      
      const result = await updateProfileFromForm(profile.userId, formData);
      
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        setError(result.error || 'Failed to update emergency contact');
      }
    } catch (err) {
      setError('Failed to update emergency contact. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setIsUpdatingProfile(true);
      const formData = new FormData();
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);
      
      const result = await changePasswordFromForm(userId, formData);
      
      if (result.success) {
        setError(null);
        return true;
      } else {
        setError(result.error || 'Failed to change password');
        return false;
      }
    } catch (err) {
      setError('Failed to change password. Please try again.');
      return false;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    if (!profile) return;
    
    try {
      setIsUpdatingProfile(true);
      const result = profile.security.twoFactorEnabled 
        ? await disableTwoFactorAction(profile.userId)
        : await enableTwoFactorAction(profile.userId);
      
      if (result.success) {
        // Reload profile to get updated 2FA status
        const updatedProfile = await getCurrentUserProfile();
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
      } else {
        setError(result.error || 'Failed to update two-factor authentication');
      }
    } catch (err) {
      setError('Failed to update two-factor authentication. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUploadCertificate = async (file: File, metadata: {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
  }) => {
    // Mock implementation - replace with actual certificate upload logic
    console.log('Upload certificate:', file, metadata);
  };

  const handleDeleteCertification = async (id: string) => {
    // Mock implementation - replace with actual deletion logic
    console.log('Delete certification:', id);
  };

  const handleDownloadCertificate = async (id: string) => {
    // Mock implementation - replace with actual download logic
    console.log('Download certificate:', id);
  };

  const handleExportActivity = async (timeframe: string) => {
    // Mock implementation - replace with actual export logic
    console.log('Export activity:', timeframe);
  };

  const handleRefreshActivity = async () => {
    // Mock implementation - replace with actual refresh logic
    console.log('Refresh activity');
  };

  const handleUpdatePreferences = async (preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    desktopNotifications: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    dateFormat: string;
    timeFormat: '12h' | '24h';
    currency: string;
    autoSave: boolean;
    defaultView: string;
    itemsPerPage: number;
  }) => {
    if (!profile) return;
    
    try {
      setIsUpdatingPreferences(true);
      // Mock implementation - replace with actual preferences update logic
      console.log('Update preferences:', preferences);
      setError(null);
    } catch (err) {
      setError('Failed to update preferences. Please try again.');
    } finally {
      setIsUpdatingPreferences(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <ProfileHeader
        profile={{
          firstName: profile.firstName,
          lastName: profile.lastName,
          title: profile.title || '',
          department: profile.department || '',
          employeeId: profile.employeeId,
          hireDate: profile.hireDate,
          lastLogin: profile.lastLogin,
          profileImage: profile.profileImage
        }}
        onEditProfile={handleEditProfile}
        onUploadAvatar={handleUploadAvatar}
        onExportData={handleExportData}
        isUploading={isUploadingAvatar}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <PersonalInformation
          personalInfo={{
            firstName: profile.firstName,
            lastName: profile.lastName,
            title: profile.title || '',
            department: profile.department || '',
            employeeId: profile.employeeId,
            hireDate: profile.hireDate
          }}
          onUpdatePersonalInfo={handleUpdatePersonalInfo}
          isUpdating={isUpdatingProfile}
        />

        {/* Contact Information */}
        <ContactInformation
          email={profile.email}
          phone={profile.phone || ''}
          address={profile.address}
          onUpdateContact={handleUpdateContact}
          isUpdating={isUpdatingProfile}
        />

        {/* Emergency Contact */}
        <EmergencyContact
          emergencyContact={profile.emergencyContact}
          onUpdateEmergencyContact={handleUpdateEmergencyContact}
          isUpdating={isUpdatingProfile}
        />

        {/* Security Settings */}
        <SecuritySettings
          profile={profile}
          onPasswordChange={handleChangePassword}
          onToggleTwoFactor={handleToggleTwoFactor}
          disabled={isUpdatingProfile}
        />
      </div>

      {/* Certifications */}
      <Certifications
        certifications={profile.certifications}
        onUploadCertificate={handleUploadCertificate}
        onDeleteCertification={handleDeleteCertification}
        onDownloadCertificate={handleDownloadCertificate}
        isUploading={false}
      />

      {/* Recent Activity */}
      <RecentActivity
        activities={profile.recentActivity.map(activity => ({
          ...activity,
          outcome: 'success' as const // Default to success if not present
        }))}
        onExportActivity={handleExportActivity}
        onRefreshActivity={handleRefreshActivity}
        isLoading={false}
      />

      {/* Preferences */}
      <Preferences
        preferences={{
          emailNotifications: profile.preferences.emailNotifications,
          smsNotifications: profile.preferences.smsNotifications,
          desktopNotifications: profile.preferences.desktopNotifications,
          marketingEmails: true, // Default values for missing fields
          securityAlerts: true,
          language: profile.preferences.language,
          timezone: profile.preferences.timezone,
          theme: profile.preferences.theme,
          dateFormat: 'MM/DD/YYYY', // Default format
          timeFormat: '12h' as const,
          currency: 'USD', // Default currency
          autoSave: true, // Default setting
          defaultView: 'dashboard', // Default view
          itemsPerPage: 25 // Default items per page
        }}
        onUpdatePreferences={handleUpdatePreferences}
        isUpdating={isUpdatingPreferences}
      />
    </div>
  );
}
