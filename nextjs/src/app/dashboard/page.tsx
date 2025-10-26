/**
 * Dashboard Page - White Cross Healthcare Platform (Next.js)
 * Main dashboard with overview statistics and quick actions
 *
 * @module app/dashboard/page
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react';

// UI Components
import { Card } from '@/components/ui/layout/Card';

interface DashboardStats {
  totalStudents: number;
  activeAppointments: number;
  pendingIncidents: number;
  healthRecordsToday: number;
  medicationsAdministered: number;
  emergencyContacts: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  permission?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeAppointments: 0,
    pendingIncidents: 0,
    healthRecordsToday: 0,
    medicationsAdministered: 0,
    emergencyContacts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  // Quick actions configuration
  const quickActions: QuickAction[] = [
    {
      id: 'students',
      title: 'Manage Students',
      description: 'View and manage student records',
      icon: Users,
      href: '/students',
      color: 'bg-blue-500',
      permission: 'students.read',
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Schedule and manage appointments',
      icon: Calendar,
      href: '/appointments',
      color: 'bg-green-500',
      permission: 'appointments.read',
    },
    {
      id: 'health-records',
      title: 'Health Records',
      description: 'Access student health information',
      icon: FileText,
      href: '/health-records',
      color: 'bg-purple-500',
      permission: 'health_records.read',
    },
    {
      id: 'incidents',
      title: 'Incident Reports',
      description: 'Report and track incidents',
      icon: AlertTriangle,
      href: '/incident-reports',
      color: 'bg-red-500',
      permission: 'incident_reports.read',
    },
    {
      id: 'medications',
      title: 'Medications',
      description: 'Manage medication administration',
      icon: Activity,
      href: '/medications',
      color: 'bg-orange-500',
      permission: 'medications.read',
    },
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Track medical supplies',
      icon: TrendingUp,
      href: '/inventory',
      color: 'bg-indigo-500',
      permission: 'inventory.read',
    },
  ];

  // Load dashboard statistics
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // TODO: Replace with actual API call using apiClient
        // const response = await apiClient.get(API_ENDPOINTS.dashboardStats);

        // Mock data for now
        setTimeout(() => {
          setStats({
            totalStudents: 1247,
            activeAppointments: 23,
            pendingIncidents: 5,
            healthRecordsToday: 34,
            medicationsAdministered: 67,
            emergencyContacts: 890,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Welcome back, {userName}! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalStudents.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeAppointments}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingIncidents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Records Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.healthRecordsToday}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medications Given</p>
              <p className="text-2xl font-bold text-gray-900">{stats.medicationsAdministered}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Emergency Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.emergencyContacts}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-600">Access frequently used features</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className="group relative bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 p-3 rounded-lg ${action.color} text-white`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Card>

      {/* System Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">All systems operational</p>
            <p className="text-sm text-green-700">
              HIPAA compliance active • Data encrypted • Backups current
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
