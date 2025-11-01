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



export default function MessagesPage() {
  // Redirect to main inbox
  redirect('/communications');
}
