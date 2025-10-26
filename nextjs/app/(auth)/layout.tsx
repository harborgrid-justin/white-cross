/**
 * Auth Layout - Public Authentication Pages
 *
 * This layout wraps all authentication pages (login, access-denied).
 * It provides a minimal layout without the dashboard sidebar/header.
 *
 * @remarks
 * - No authentication required (public routes)
 * - Minimal UI (centered content)
 * - HIPAA compliance notice
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {children}
    </div>
  );
}
