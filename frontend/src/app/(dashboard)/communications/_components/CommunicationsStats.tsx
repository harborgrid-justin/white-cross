/**
 * @fileoverview Communications Statistics Component - Display messaging statistics
 * @module app/(dashboard)/communications/_components/CommunicationsStats
 * @category Communications - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import {
  MessageCircle,
  CheckCircle,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { calculateDeliveryRate, calculateReadRate } from './communications.utils';

export interface CommunicationStats {
  totalMessages: number;
  sentToday: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  emergencyCount: number;
  scheduledCount: number;
  averageResponseTime: number;
}

interface CommunicationsStatsProps {
  stats: CommunicationStats;
}

export function CommunicationsStats({ stats }: CommunicationsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Messages Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalMessages.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {stats.sentToday} sent today
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Delivered Messages Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.deliveredCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {calculateDeliveryRate(stats.deliveredCount, stats.totalMessages)}% delivery rate
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Read Messages Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Read Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.readCount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {calculateReadRate(stats.readCount, stats.deliveredCount)}% read rate
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Messages Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Emergency Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.emergencyCount}
              </p>
              <p className="text-xs text-gray-500">
                Avg response: {stats.averageResponseTime}min
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
