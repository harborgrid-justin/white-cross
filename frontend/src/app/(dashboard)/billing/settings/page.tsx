/**
 * Force dynamic rendering for user-specific billing settings
 */


import { BillingSettings } from '@/components/pages/Billing';

/**
 * Billing Settings Page
 * 
 * Configuration and settings management for billing system including
 * company information, payment gateways, tax settings, and preferences.
 */
export default function BillingSettingsPage() {
  return (
    <BillingSettings
      onSaveSettings={(settings) => {
        console.log('Saving settings:', settings);
        // Handle settings save - could include company info, payment gateway, etc.
      }}
      onTestGateway={() => {
        console.log('Testing payment gateway');
        // Handle payment gateway test
      }}
      onExportSettings={() => {
        console.log('Exporting settings');
        // Handle settings export
      }}
      onImportSettings={() => {
        console.log('Importing settings');
        // Handle settings import
      }}
    />
  );
}
