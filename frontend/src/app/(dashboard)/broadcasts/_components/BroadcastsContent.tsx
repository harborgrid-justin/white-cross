/**
 * BroadcastsContent Component - White Cross Healthcare Platform
 * 
 * Mass communication system featuring:
 * - Emergency broadcast notifications
 * - School-wide health announcements
 * - Parent/guardian communications
 * - Staff alert systems
 * - Scheduled messaging campaigns
 * 
 * @component BroadcastsContent
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  AlertTriangle, 
  Clock, 
  Send,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Plus,
  Radio,
  MessageSquare,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  getBroadcastDashboardData,
  getBroadcastStats,
  type Broadcast,
  type BroadcastStats
} from '@/lib/actions/broadcasts.actions';

// Healthcare broadcast types imported from server actions
// Component uses transformed data to match UI expectations
interface DisplayBroadcast extends Omit<Broadcast, 'type' | 'priority' | 'content'> {
  message: string;
  type: 'emergency' | 'health-alert' | 'announcement' | 'reminder' | 'policy-update';
  priority: 'low' | 'normal' | 'high' | 'critical';
  recipients: string[];
  recipientGroups: string[];
  scheduledTime?: string;
  sentTime?: string;
  deliveryStats?: {
    sent: number;
    delivered: number;
    opened: number;
    failed: number;
  };
}

export default function BroadcastsContent() {
  const [broadcasts, setBroadcasts] = useState<DisplayBroadcast[]>([]);
  const [stats, setStats] = useState<BroadcastStats>({
    totalBroadcasts: 0,
    activeCampaigns: 0,
    scheduledMessages: 0,
    totalRecipients: 0,
    emergencyAlerts: 0,
    healthAlerts: 0,
    deliveryRate: 0,
    openRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter] = useState<string>('all');

  // Load broadcast data using server actions
  useEffect(() => {
    const loadBroadcastData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getBroadcastDashboardData();
        
        // Transform server data to match component expectations
        const transformedBroadcasts: DisplayBroadcast[] = dashboardData.broadcasts.map(broadcast => ({
          ...broadcast,
          message: broadcast.content,
          type: broadcast.type === 'email' ? 'announcement' as const : 
                broadcast.priority === 'urgent' ? 'emergency' as const : 'health-alert' as const,
          priority: broadcast.priority === 'urgent' ? 'critical' as const : broadcast.priority,
          recipients: [`${broadcast.targetAudience}-recipients`],
          recipientGroups: [broadcast.targetAudience.charAt(0).toUpperCase() + broadcast.targetAudience.slice(1)],
          scheduledTime: broadcast.scheduledAt,
          sentTime: broadcast.sentAt,
          createdBy: broadcast.createdByName || 'System User',
          deliveryStats: {
            sent: broadcast.totalRecipients,
            delivered: broadcast.successCount,
            opened: Math.round(broadcast.totalRecipients * (broadcast.openRate || 0) / 100),
            failed: broadcast.failureCount
          }
        }));
        
        setBroadcasts(transformedBroadcasts);
        setStats(dashboardData.stats);
      } catch (error) {
        console.error('Error loading broadcast data:', error);
        // Set empty data on error
        setBroadcasts([]);
        setStats({
          totalBroadcasts: 0,
          activeCampaigns: 0,
          scheduledMessages: 0,
          totalRecipients: 0,
          emergencyAlerts: 0,
          healthAlerts: 0,
          deliveryRate: 0,
          openRate: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadBroadcastData();
  }, []);

  // Filter broadcasts
  const filteredBroadcasts = broadcasts.filter((broadcast) => {
    const matchesSearch = searchTerm.length < 2 || 
      broadcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broadcast.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broadcast.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || broadcast.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || broadcast.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || broadcast.priority === priorityFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  // Helper function to format dates
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mass Communications</h1>
            <p className="text-gray-600">Manage emergency broadcasts and health notifications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mass Communications</h1>
          <p className="text-gray-600">Manage emergency broadcasts and health notifications</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Broadcasts</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalBroadcasts}</p>
              </div>
              <Megaphone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</p>
              </div>
              <Radio className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled Messages</p>
                <p className="text-2xl font-bold text-orange-600">{stats.scheduledMessages}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalRecipients}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <Input
            placeholder="Search broadcasts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="emergency">Emergency</option>
          <option value="health-alert">Health Alert</option>
          <option value="announcement">Announcement</option>
          <option value="reminder">Reminder</option>
          <option value="policy-update">Policy Update</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Broadcasts List */}
      <div className="space-y-4">
        {filteredBroadcasts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No broadcasts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'No broadcasts match your current filters.'
                  : 'Get started by creating your first broadcast message.'}
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Broadcast
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredBroadcasts.map((broadcast) => (
            <Card key={broadcast.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{broadcast.title}</h3>
                      <Badge 
                        className={
                          broadcast.type === 'emergency' ? 'bg-red-100 text-red-800' :
                          broadcast.type === 'health-alert' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {broadcast.type.replace('-', ' ')}
                      </Badge>
                      <Badge 
                        className={
                          broadcast.status === 'sent' ? 'bg-green-100 text-green-800' :
                          broadcast.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          broadcast.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {broadcast.status}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{broadcast.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{broadcast.recipientGroups.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {broadcast.status === 'scheduled' && broadcast.scheduledTime
                            ? `Scheduled: ${formatDate(broadcast.scheduledTime)}`
                            : broadcast.sentTime
                              ? `Sent: ${formatDate(broadcast.sentTime)}`
                              : `Created: ${formatDate(broadcast.createdAt)}`}
                        </span>
                      </div>
                    </div>

                    {broadcast.deliveryStats && (
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Sent: {broadcast.deliveryStats.sent}</span>
                        <span>Delivered: {broadcast.deliveryStats.delivered}</span>
                        <span>Opened: {broadcast.deliveryStats.opened}</span>
                        {broadcast.deliveryStats.failed > 0 && (
                          <span className="text-red-600">Failed: {broadcast.deliveryStats.failed}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}


