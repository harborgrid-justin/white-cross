/**
 * ContactsDashboard Component
 * 
 * Contacts Dashboard with Apollo Client integration for real-time statistics.
 */

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CONTACT_STATS } from '../../../services/graphql/contacts';
import { LoadingSpinner } from '../../../components/ui/feedback';

interface ContactsDashboardProps {
  className?: string;
}

/**
 * ContactsDashboard component - Contacts Dashboard with statistics
 */
const ContactsDashboard: React.FC<ContactsDashboardProps> = ({ className = '' }) => {
  const { data, loading, error } = useQuery(GET_CONTACT_STATS, {
    fetchPolicy: 'cache-and-network',
  });

  const stats = data?.contactStats;

  return (
    <div className={`contacts-dashboard ${className}`}>
      <div className="card p-6 bg-white rounded-lg shadow">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Contacts Dashboard</h3>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <p className="font-medium">Error loading statistics</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        )}
        
        {!loading && !error && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Contacts */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Contacts</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{stats.total}</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Contacts by Type */}
            {stats.byType && Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 uppercase tracking-wide">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </p>
                    <p className="text-3xl font-bold text-green-900 mt-2">{count as number}</p>
                  </div>
                  <div className="bg-green-200 p-3 rounded-full">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && !stats && (
          <div className="text-center text-gray-500 py-8">
            <p>No statistics available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsDashboard;
