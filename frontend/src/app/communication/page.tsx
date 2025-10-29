/**
 * @fileoverview Communication Hub - Main communication management page
 * @module app/communication/page
 * @version 1.0.0
 *
 * Multi-channel messaging system for healthcare communication supporting:
 * - Email, SMS, Push Notifications, Voice
 * - Message templates with variable substitution
 * - Priority-based routing
 * - Broadcast messaging with recipient selection
 * - Emergency communications with real-time updates
 */

import React from 'react'
import { Metadata } from 'next'
import CommunicationHub from '@/components/features/communication/CommunicationHub'

export const metadata: Metadata = {
  title: 'Communication | White Cross',
  description: 'Multi-channel messaging and communication management',
}

// Force dynamic rendering due to client-side data requirements
export const dynamic = "force-dynamic";

/**
 * Communication Hub Page
 *
 * Server component that renders the communication management interface.
 * Tabs include: Compose, History, Templates, Broadcast, Emergency
 *
 * @remarks
 * - Uses Client Component for interactive features
 * - Server Actions for message sending
 * - Real-time updates via WebSocket for emergency messages
 */
export default function CommunicationPage() {
  return <CommunicationHub />
}
