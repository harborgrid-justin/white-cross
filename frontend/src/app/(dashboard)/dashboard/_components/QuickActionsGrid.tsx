/**
 * QuickActionsGrid Component
 *
 * Displays quick action shortcuts for common healthcare tasks:
 * - New Appointment scheduling
 * - Medication Log recording
 * - Emergency Alert sending
 * - Health Report generation
 * - Health Screening conduction
 * - Message sending to parents/staff
 *
 * @component
 */

'use client';

import React from 'react';
import {
  Plus,
  Pill,
  AlertTriangle,
  FileText,
  UserCheck,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuickActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  description: string;
  ariaLabel: string;
  onClick?: () => void;
}

function QuickActionCard({
  icon: Icon,
  iconColor,
  title,
  description,
  ariaLabel,
  onClick,
}: QuickActionCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <Card
      className="cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 transition-colors"
      role="listitem"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <CardContent className="p-6 text-center">
        <Icon className={`h-8 w-8 ${iconColor} mx-auto mb-3`} aria-hidden="true" />
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

interface QuickActionsGridProps {
  onActionClick?: (actionType: string) => void;
}

export function QuickActionsGrid({ onActionClick }: QuickActionsGridProps) {
  const handleAction = (actionType: string) => {
    onActionClick?.(actionType);
    // In a real app, this would navigate to the appropriate page
    console.log(`Quick action: ${actionType}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="list" aria-label="Quick action shortcuts">
      <QuickActionCard
        icon={Plus}
        iconColor="text-blue-600"
        title="New Appointment"
        description="Schedule a health appointment"
        ariaLabel="Schedule a new health appointment"
        onClick={() => handleAction('new-appointment')}
      />

      <QuickActionCard
        icon={Pill}
        iconColor="text-green-600"
        title="Medication Log"
        description="Record medication administration"
        ariaLabel="Record medication administration"
        onClick={() => handleAction('medication-log')}
      />

      <QuickActionCard
        icon={AlertTriangle}
        iconColor="text-red-600"
        title="Emergency Alert"
        description="Send emergency notification"
        ariaLabel="Send emergency notification"
        onClick={() => handleAction('emergency-alert')}
      />

      <QuickActionCard
        icon={FileText}
        iconColor="text-purple-600"
        title="Health Report"
        description="Generate health summary"
        ariaLabel="Generate health summary report"
        onClick={() => handleAction('health-report')}
      />

      <QuickActionCard
        icon={UserCheck}
        iconColor="text-indigo-600"
        title="Health Screening"
        description="Conduct health assessment"
        ariaLabel="Conduct health assessment"
        onClick={() => handleAction('health-screening')}
      />

      <QuickActionCard
        icon={MessageSquare}
        iconColor="text-orange-600"
        title="Send Message"
        description="Contact parents or staff"
        ariaLabel="Contact parents or staff"
        onClick={() => handleAction('send-message')}
      />
    </div>
  );
}
