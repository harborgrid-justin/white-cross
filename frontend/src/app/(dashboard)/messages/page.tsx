/**
 * Force dynamic rendering for real-time messages - healthcare communication requires current state
 */
export const dynamic = 'force-dynamic';

import React from 'react';
import { Metadata } from 'next';
import MessagesContent from './_components/MessagesContent';

/**
 * Messages Page - Healthcare Communication Management
 * 
 * This page provides comprehensive healthcare messaging functionality including:
 * - Emergency alerts and urgent communications
 * - Medical messages and health records communication  
 * - Parent communications and family correspondence
 * - Staff notifications and administrative messages
 * - Appointment reminders and scheduling communications
 * - HIPAA-compliant secure messaging with encryption
 * - Audit logging for all PHI-related communications
 * 
 * Features:
 * - Real-time message updates and notifications
 * - Advanced filtering by type, priority, and status
 * - Bulk message operations (read, archive, delete)
 * - Message search across content, senders, and students
 * - Acknowledgment tracking for critical messages
 * - Attachment support with encryption for PHI
 * - Thread management and message organization
 */
export default function MessagesPage(): React.JSX.Element {
  return (
    <div className="h-full flex flex-col">
      <MessagesContent />
    </div>
  );
}

/**
 * Page Metadata
 */
export const metadata: Metadata = {
  title: 'Messages - Healthcare Communications',
  description: 'Manage healthcare communications including emergency alerts, medical messages, parent communications, and staff notifications with HIPAA compliance and secure messaging.',
  keywords: 'healthcare messages, emergency alerts, medical communication, parent notifications, staff messages, HIPAA messaging, secure communication'
};
