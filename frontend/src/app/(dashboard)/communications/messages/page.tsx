/**
 * Messages List Page
 *
 * All messages view
 */

import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Messages | Communications',
  description: 'View all messages'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

export default function MessagesPage() {
  // Redirect to main inbox
  redirect('/communications');
}
