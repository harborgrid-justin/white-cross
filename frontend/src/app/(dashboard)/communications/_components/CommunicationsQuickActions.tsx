/**
 * @fileoverview Communications Quick Actions Component - Action buttons for common tasks
 * @module app/(dashboard)/communications/_components/CommunicationsQuickActions
 * @category Communications - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Megaphone,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface CommunicationsQuickActionsProps {
  onCompose?: () => void;
  onBroadcast?: () => void;
  onEmergencyAlert?: () => void;
  onTemplates?: () => void;
}

export function CommunicationsQuickActions({
  onCompose,
  onBroadcast,
  onEmergencyAlert,
  onTemplates
}: CommunicationsQuickActionsProps) {
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Button
            className="justify-start"
            onClick={onCompose}
          >
            <Plus className="h-4 w-4 mr-2" />
            Compose Message
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={onBroadcast}
          >
            <Megaphone className="h-4 w-4 mr-2" />
            Send Broadcast
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={onEmergencyAlert}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Alert
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={onTemplates}
          >
            <FileText className="h-4 w-4 mr-2" />
            Message Templates
          </Button>
        </div>
      </div>
    </Card>
  );
}
