/**
 * @fileoverview Communications Inbox Page - Main Hub for Healthcare Messages
 *
 * **Purpose**: Central communication hub for school nurses to view, manage, and organize
 * message threads with parents, guardians, and healthcare staff. Provides inbox functionality
 * with real-time updates, message filtering, and bulk operations.
 *
 * **Key Features**:
 * - Message thread listing with unread indicators
 * - Search and filter capabilities (status, date, sender)
 * - Bulk message operations (archive, delete, mark as read)
 * - Real-time message updates via Socket.io
 * - HIPAA-compliant audit logging for all message access
 * - Integration with message composer and detail views
 *
 * **HIPAA Compliance**:
 * - All message access logged for audit trails
 * - PHI data encrypted in transit and at rest
 * - Secure authentication required (force-dynamic rendering)
 * - Messages marked as containing PHI flagged appropriately
 *
 * **Navigation Flow**:
 * - View thread list → Select thread → View message details
 * - Compose new message → Send → Return to inbox
 * - Search/filter → Bulk operations → Refresh list
 *
 * **Real-Time Features**:
 * - WebSocket connection for new message notifications
 * - Live unread count updates
 * - Push notifications for urgent messages
 *
 * @module CommunicationsPage
 * @requires React
 * @requires next/Metadata
 * @requires ./InboxContent
 *
 * @example
 * // Accessed via Next.js routing at /communications
 * // Force-dynamic ensures fresh authentication checks on each visit
 *
 * @see {@link InboxContent} - Main inbox component
 * @see {@link /communications/compose} - Message composer
 * @see {@link /communications/messages/[id]} - Message detail view
 *
 * @since 1.0.0
 */

import React from 'react';
import { Metadata } from 'next';
import { InboxContent } from './InboxContent';

/**
 * Metadata configuration for the Communications Inbox page.
 * Provides SEO-friendly title and description for browser tabs and search engines.
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: 'Inbox | Communications',
  description: 'View and manage your messages'
};

/**
 * Force dynamic rendering to ensure authentication checks on every page visit.
 * This is critical for HIPAA compliance and secure message access.
 *
 * @constant {string}
 */
export const dynamic = "force-dynamic";

/**
 * Communications Inbox Page Component
 *
 * Server component that renders the main communications inbox. Forces dynamic
 * rendering to ensure proper authentication and authorization checks before
 * displaying protected health information.
 *
 * **Security**:
 * - Requires authenticated user session
 * - Validates user permissions for message access
 * - All message views logged for HIPAA audit compliance
 *
 * **Performance**:
 * - Server-side rendering for initial page load
 * - Client-side hydration for interactive features
 * - Real-time updates via WebSocket after hydration
 *
 * @returns {JSX.Element} The communications inbox page with message threads
 *
 * @example
 * // Automatically rendered by Next.js when navigating to /communications
 * // User must be authenticated with proper permissions
 */
export default function CommunicationsPage() {
  return <InboxContent />;
}
