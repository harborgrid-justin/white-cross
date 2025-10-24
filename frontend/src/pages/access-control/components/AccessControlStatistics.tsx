/**
 * WF-AC-COMP-012 | AccessControlStatistics.tsx - Access Control Statistics
 * Purpose: Display access control metrics and statistics
 * Dependencies: react, redux, lucide-react
 * Exports: AccessControlStatistics component
 * Last Updated: 2025-10-24
 */

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { fetchAccessControlStatistics, selectSecurityMetrics, selectStatistics } from '../store';
import { BarChart3, Shield, Users, AlertTriangle, Activity, TrendingUp } from 'lucide-react';

/**
 * AccessControlStatistics Component
 *
 * Displays comprehensive security statistics:
 * - Role and permission metrics
 * - Security incident trends
 * - Active session counts
 * - Security score
 *
 * @returns React component
 */
const AccessControlStatistics: React.FC = () => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(selectSecurityMetrics);
  const statistics = useAppSelector(selectStatistics);

  useEffect(() => {
    dispatch(fetchAccessControlStatistics());
  }, [dispatch]);

  const statCards = [
    {
      icon: Shield,
      label: 'Total Roles',
      value: metrics.totalRoles || 0,
      subtext: `${metrics.activeRoles || 0} active`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Users,
      label: 'Permissions',
      value: metrics.totalPermissions || 0,
      subtext: 'System-wide',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: AlertTriangle,
      label: 'Security Incidents',
      value: metrics.recentIncidents || 0,
      subtext: 'Last 24 hours',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Activity,
      label: 'Active Sessions',
      value: metrics.activeSessions || 0,
      subtext: 'Currently active',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: TrendingUp,
      label: 'Security Score',
      value: metrics.securityScore || 0,
      subtext: 'Out of 100',
      color: metrics.securityScore >= 80 ? 'text-green-600' : metrics.securityScore >= 60 ? 'text-yellow-600' : 'text-red-600',
      bgColor: metrics.securityScore >= 80 ? 'bg-green-100' : metrics.securityScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Access Control Statistics</h1>
        </div>
        <p className="mt-2 text-gray-600">
          Security metrics and analytics dashboard
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Incidents Alert */}
      {metrics.criticalIncidents > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
            <div>
              <h3 className="font-medium text-red-900 mb-1">
                Critical Security Alert
              </h3>
              <p className="text-sm text-red-700">
                There {metrics.criticalIncidents === 1 ? 'is' : 'are'} {metrics.criticalIncidents} critical security {metrics.criticalIncidents === 1 ? 'incident' : 'incidents'} requiring immediate attention.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Statistics */}
      {statistics && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="font-medium text-gray-900 mb-4">Detailed Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="border-b pb-2">
              <span className="text-gray-600">Total Users:</span>
              <span className="ml-2 font-medium text-gray-900">{statistics.totalUsers || 'N/A'}</span>
            </div>
            <div className="border-b pb-2">
              <span className="text-gray-600">Failed Login Attempts (24h):</span>
              <span className="ml-2 font-medium text-gray-900">{statistics.failedLogins || 0}</span>
            </div>
            <div className="border-b pb-2">
              <span className="text-gray-600">IP Restrictions:</span>
              <span className="ml-2 font-medium text-gray-900">{statistics.ipRestrictions || 0}</span>
            </div>
            <div className="border-b pb-2">
              <span className="text-gray-600">Last Security Scan:</span>
              <span className="ml-2 font-medium text-gray-900">
                {statistics.lastScan ? new Date(statistics.lastScan).toLocaleString() : 'Never'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessControlStatistics;
