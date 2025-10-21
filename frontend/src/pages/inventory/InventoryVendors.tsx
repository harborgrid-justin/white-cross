/**
 * WF-INV-004 | InventoryVendors.tsx - Inventory vendors management
 * Purpose: Manage vendor information and relationships
 * Upstream: ../services/modules/health/inventoryApi | Dependencies: react
 * Downstream: Inventory management system | Called by: React router
 * Related: InventoryItems.tsx, InventoryAlerts.tsx, InventoryTransactions.tsx
 * Exports: default InventoryVendors component
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: Load vendors → Display list → Manage vendor info
 * LLM Context: Vendor management for inventory procurement
 */

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

interface Vendor {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  categories: string[];
  status: 'ACTIVE' | 'INACTIVE';
  itemCount: number;
  lastOrderDate?: string;
}

const InventoryVendors: React.FC = () => {
  const { user } = useAuthContext();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const mockVendors: Vendor[] = [
    {
      id: '1',
      name: 'MedSupply Inc',
      contactPerson: 'John Smith',
      email: 'john@medsupply.com',
      phone: '+1-555-0123',
      address: '123 Medical Way, Healthcare City, HC 12345',
      categories: ['MEDICATION'],
      status: 'ACTIVE',
      itemCount: 15,
      lastOrderDate: '2025-10-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Healthcare Supply Co',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@healthsupply.com',
      phone: '+1-555-0456',
      address: '456 Supply Street, Medical District, MD 67890',
      categories: ['SUPPLIES', 'EQUIPMENT'],
      status: 'ACTIVE',
      itemCount: 28,
      lastOrderDate: '2025-10-18T14:20:00Z',
    },
    {
      id: '3',
      name: 'MedTech Solutions',
      contactPerson: 'Robert Brown',
      email: 'robert@medtech.com',
      phone: '+1-555-0789',
      categories: ['EQUIPMENT'],
      status: 'ACTIVE',
      itemCount: 8,
    },
  ];

  useEffect(() => {
    const loadVendors = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setVendors(mockVendors);
      setLoading(false);
    };
    loadVendors();
  }, []);

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getCategoryBadge = (category: string) => {
    const config = {
      MEDICATION: 'bg-blue-100 text-blue-800',
      SUPPLIES: 'bg-purple-100 text-purple-800',
      EQUIPMENT: 'bg-orange-100 text-orange-800',
    };
    return config[category as keyof typeof config] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading vendors...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Vendors</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage vendor relationships and contact information
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vendor
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {vendors.map((vendor) => (
            <li key={vendor.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{vendor.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(vendor.status)}`}>
                        {vendor.status}
                      </span>
                      <span className="text-sm text-gray-500">{vendor.itemCount} items</span>
                    </div>
                  </div>
                  
                  {vendor.contactPerson && (
                    <p className="mt-1 text-sm text-gray-600">Contact: {vendor.contactPerson}</p>
                  )}
                  
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    {vendor.email && (
                      <span className="flex items-center">
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        {vendor.email}
                      </span>
                    )}
                    {vendor.phone && (
                      <span className="flex items-center">
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {vendor.phone}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {vendor.categories.map((category) => (
                      <span key={category} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(category)}`}>
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="ml-6 flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryVendors;
