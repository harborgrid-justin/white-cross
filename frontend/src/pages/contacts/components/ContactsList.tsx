/**
 * ContactsList Component
 * 
 * Contacts List with Apollo Client integration for querying and displaying contacts.
 */

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CONTACTS, Contact, ContactFilterInput } from '../../../services/graphql/contacts';
import { LoadingSpinner } from '../../../components/ui/feedback';
import CreateContactDialog from './CreateContactDialog';

interface ContactsListProps {
  className?: string;
}

/**
 * ContactsList component - Contacts List with filtering
 */
const ContactsList: React.FC<ContactsListProps> = ({ className = '' }) => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ContactFilterInput>({
    isActive: true,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_CONTACTS, {
    variables: {
      page,
      limit: 20,
      orderBy: 'lastName',
      orderDirection: 'ASC',
      filters,
    },
    fetchPolicy: 'cache-and-network',
  });

  const contacts = data?.contacts?.contacts || [];
  const pagination = data?.contacts?.pagination;

  const handleFilterChange = (newFilters: Partial<ContactFilterInput>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const getContactTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      guardian: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
      vendor: 'bg-purple-100 text-purple-800',
      provider: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || colors.other;
  };

  return (
    <div className={`contacts-list ${className}`}>
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Contacts List</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Contact
              </button>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange({
                    isActive: value === 'all' ? undefined : value === 'active',
                  });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type || 'all'}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange({
                    type: value === 'all' ? undefined : value as any,
                  });
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="guardian">Guardian</option>
                <option value="staff">Staff</option>
                <option value="vendor">Vendor</option>
                <option value="provider">Provider</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p className="font-medium">Error loading contacts</p>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          )}

          {!loading && !error && contacts.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-medium">No contacts found</p>
              <p className="text-sm mt-1">Try adjusting your filters or create a new contact</p>
            </div>
          )}

          {!loading && !error && contacts.length > 0 && (
            <>
              <div className="grid gap-4">
                {contacts.map((contact: Contact) => (
                  <div
                    key={contact.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {contact.fullName}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContactTypeColor(contact.type)}`}>
                            {contact.type}
                          </span>
                          {!contact.isActive && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Inactive
                            </span>
                          )}
                        </div>
                        
                        {contact.organization && (
                          <p className="text-sm text-gray-600 mt-1">{contact.organization}</p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                          {contact.email && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>{contact.email}</span>
                            </div>
                          )}
                          
                          {contact.phone && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {contacts.length} of {pagination.total} contacts
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1">
                      Page {page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={page >= pagination.totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Contact Dialog */}
      <CreateContactDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default ContactsList;
