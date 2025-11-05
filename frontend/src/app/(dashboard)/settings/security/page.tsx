/**
 * @fileoverview Security Settings Page
 * @module app/(dashboard)/settings/security
 * @category Settings - Security
 *
 * Comprehensive security management including password changes, 2FA setup,
 * active sessions, and security audit log.
 */

import type { Metadata } from 'next';
import { SecuritySettingsContent } from '../_components/SecuritySettingsContent';

export const metadata: Metadata = {
  title: 'Security Settings | White Cross',
  description: 'Manage your account security, password, and two-factor authentication'
};

export default function SecuritySettingsPage() {
  return <SecuritySettingsContent />;
}
