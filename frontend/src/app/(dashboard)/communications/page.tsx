/**
 * @fileoverview Communications Page - Healthcare messaging and communication management
 * @module app/(dashboard)/communications/page
 * @category Communications - Pages
 */

import { CommunicationsContent } from './_components/CommunicationsContent';

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