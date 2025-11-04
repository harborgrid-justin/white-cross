/**
 * @fileoverview Custom hook for loading and managing profile data
 * @module app/(dashboard)/profile/_components/hooks/useProfileData
 * @category Profile - Hooks
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentUserProfile,
  getProfileSettings,
  getSecurityLogs,
  getActiveSessions,
  type UserProfile,
  type ProfileSettings,
  type SecurityLog,
  type ActiveSession
} from '@/lib/actions/profile.actions';

interface UseProfileDataReturn {
  profile: UserProfile | null;
  settings: ProfileSettings | null;
  securityLogs: SecurityLog[];
  sessions: ActiveSession[];
  loading: boolean;
  error: string | null;
  refetchProfile: () => Promise<void>;
  updateProfile: (profile: UserProfile) => void;
}

/**
 * Custom hook for managing profile data loading and state
 * Handles concurrent data fetching and error states
 */
export function useProfileData(): UseProfileDataReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfileData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const updateProfile = useCallback((updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  }, []);

  return {
    profile,
    settings,
    securityLogs,
    sessions,
    loading,
    error,
    refetchProfile: loadProfileData,
    updateProfile
  };
}
