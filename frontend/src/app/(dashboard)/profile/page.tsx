/**
 * @fileoverview Profile Redirect Page
 * @module app/(dashboard)/profile/page
 * @category Profile - Redirect
 *
 * Redirects old /profile URL to new /settings/profile location.
 */

import { redirect } from 'next/navigation';

export default function ProfileRedirectPage() {
  redirect('/settings/profile');
}
