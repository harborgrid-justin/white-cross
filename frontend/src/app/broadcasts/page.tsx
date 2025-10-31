/**
 * @fileoverview Broadcasts Page - Main broadcasts management page
 * @module app/broadcasts/page
 * @version 1.0.0
 *
 * Broadcast management system for healthcare communication supporting:
 * - Broadcast creation and scheduling
 * - Message templates with variable substitution
 * - Recipient group management
 * - Broadcast history and analytics
 * - Emergency broadcast protocols
 */

import React from 'react'
import { Metadata } from 'next'
import BroadcastsHub from '@/components/features/broadcasts/BroadcastsHub'

export const metadata: Metadata = {
  title: 'Broadcasts | White Cross',
  description: 'Broadcast message management and communication tools',
}

// Force dynamic rendering due to client-side data requirements
export const dynamic = 'force-dynamic';

/**
 * Broadcasts Page
 *
 * Server component that renders the broadcast management interface.
 * Tabs include: Create, History, Templates, Recipients, Emergency
 *
 * @remarks
 * - Uses Client Component for interactive features
 * - Server Actions for broadcast operations
 * - Real-time updates via WebSocket for emergency broadcasts
 */
export default function BroadcastsPage() {
  return <BroadcastsHub />
}
