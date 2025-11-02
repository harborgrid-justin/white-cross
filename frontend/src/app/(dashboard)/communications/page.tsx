/**
 * @fileoverview Communications Page - Healthcare messaging and communication management
 * @module app/(dashboard)/communications/page
 * @category Communications - Pages
 */

import type { Metadata } from 'next';
import { CommunicationsContent } from './_components/CommunicationsContent';

/**
 * Metadata for communications page
 */
export const metadata: Metadata = {
  title: 'Communications',
  description: 'Comprehensive healthcare messaging system with multi-channel communication, emergency alerts, broadcast notifications, and HIPAA-compliant message tracking.',
  keywords: [
    'healthcare communications',
    'medical messaging',
    'patient notifications',
    'emergency alerts',
    'broadcast messages',
    'parent communication',
    'SMS notifications',
    'email messaging',
    'HIPAA compliant messaging'
  ],
  openGraph: {
    title: 'Communications | White Cross Healthcare',
    description: 'Advanced healthcare communication platform with multi-channel messaging, emergency alerts, and comprehensive notification management.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

interface CommunicationsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    type?: string;
    status?: string;
    priority?: string;
    recipient?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

/**
 * Communications Main Page - Healthcare messaging dashboard
 *
 * Comprehensive communications management system for healthcare messaging,
 * notifications, emergency alerts, and communication tracking.
 *
 * Features:
 * - Real-time message monitoring and status tracking
 * - Multi-channel communication (Email, SMS, Push Notifications)
 * - Emergency alert system with priority handling
 * - Broadcast messaging for health announcements
 * - Message templates and scheduling capabilities
 * - Delivery tracking and read receipts
 * - Comprehensive filtering and search functionality
 *
 * Healthcare-specific functionality:
 * - HIPAA-compliant communication logging
 * - Parent/guardian notification workflows
 * - Staff emergency communication protocols
 * - Medication reminder systems
 * - Health screening result notifications
 */
export default async function CommunicationsPage({ searchParams }: CommunicationsPageProps) {
  return <CommunicationsContent searchParams={searchParams} />;
}