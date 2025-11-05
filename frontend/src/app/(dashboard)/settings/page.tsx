/**
 * @fileoverview Settings Landing Page - Redirects to Profile
 * @module app/(dashboard)/settings/page
 * @category Settings
 *
 * Landing page for settings that redirects to profile settings.
 */

import { redirect } from 'next/navigation';

export default function SettingsPage() {
  redirect('/settings/profile');
}
