/**
 * ComplianceStatistics Component
 * Display compliance statistics and metrics
 */

import React, { useEffect } from 'react';
import { BarChart3, TrendingUp, FileText, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { fetchStatistics, selectStatistics, selectLoading } from '../store';

const ComplianceStatistics: React.FC = () => {
  const dispatch = useAppDispatch();
  const statistics = useAppSelector(selectStatistics);
  const loading = useAppSelector(state => selectLoading(state).statistics);

  useEffect(() => {
    dispatch(fetchStatistics(undefined));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading statistics...</span>
      </div>
    );
  }

  const stats = [
    { label: 'Total Reports', value: statistics?.totalReports || 0, icon: FileText, color: 'text-blue-600' },
    { label: 'Compliance Rate', value: `${statistics?.complianceRate || 0}%`, icon: Shield, color: 'text-green-600' },
    { label: 'Active Policies', value: statistics?.activePolicies || 0, icon: BarChart3, color: 'text-purple-600' },
    { label: 'Trend', value: '+12%', icon: TrendingUp, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Statistics</h1>
        <p className="text-gray-600 mt-1">Overview of compliance metrics and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Overview</h2>
        <div className="text-center text-gray-500 py-8">
          <p>Detailed compliance charts and analytics would be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default ComplianceStatistics;
