/**
 * @fileoverview Profile Components Index - Exports all profile-related components
 * @module app/(dashboard)/profile/_components
 * @category Profile - Components
 */

// Export all individual components
export { ProfileHeader } from './ProfileHeader';
export { PersonalInformation } from './PersonalInformation';
export { ContactInformation } from './ContactInformation';
export { EmergencyContact } from './EmergencyContact';
export { SecuritySettings } from './SecuritySettings';
export { Certifications } from './Certifications';
export { RecentActivity } from './RecentActivity';
export { Preferences } from './Preferences';

// Re-export the main ProfileContent component for backward compatibility
export { ProfileContent } from './ProfileContent';

// Export types that might be needed by consumers
export type { UserProfile, ProfileSettings, SecurityLog, ActiveSession } from '@/lib/actions/profile.actions';
