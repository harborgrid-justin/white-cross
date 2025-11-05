/**
 * @fileoverview Profile components barrel export
 * @module app/(dashboard)/profile/_components
 * @category Profile - Components
 */

// Main component
export { ProfileContent } from './ProfileContent';

// Feature components
export { ProfileHeader } from './ProfileHeader';
export { PersonalInfoForm } from './PersonalInfoForm';
export { ContactInfoForm } from './ContactInfoForm';
export { EmergencyContactForm } from './EmergencyContactForm';
export { SecuritySettings } from './SecuritySettings';
export { CertificationsPanel } from './CertificationsPanel';
export { ActivityLog } from './ActivityLog';
export { PreferencesPanel } from './PreferencesPanel';

// Hooks
export {
  useProfileData,
  useProfileUpdate,
  usePasswordChange,
  useEditMode
} from './hooks';

// UI components
export {
  LoadingState,
  ErrorState,
  ToggleSwitch,
  EditButton,
  FormActions
} from './ui';

// Utils
export {
  formatDate,
  formatDateTime,
  getCertificationStatusColor,
  capitalize
} from './utils';
