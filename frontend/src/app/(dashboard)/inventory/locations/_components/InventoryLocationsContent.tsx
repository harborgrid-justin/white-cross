'use client';

/**
 * InventoryLocationsContent Component
 *
 * Manage storage locations for inventory items.
 * Supports CRUD operations on location definitions.
 *
 * @module InventoryLocationsContent
 */

import React, { useState, useEffect } from 'react';
import EmptyState from '@/components/ui/feedback/EmptyState';

export interface InventoryLocation {
  id: string;
  name: string;
  description?: string;
  type: 'cabinet' | 'shelf' | 'room' | 'refrigerator' | 'locked' | 'other';
  capacity?: number;
  itemCount: number;
  temperatureControlled: boolean;
  requiresKeyAccess: boolean;
  isActive: boolean;
  createdAt: string;
}

/**
 * Inventory locations management component
 *
 * @returns Rendered locations management view
 */
function InventoryLocationsContent() {
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'cabinet' as const,
    temperatureControlled: false,
    requiresKeyAccess: false,
  });

  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockLocations: InventoryLocation[] = [
          {
            id: '1',
            name: 'Cabinet A, Shelf 2',
            description: 'Primary medication storage',
            type: 'shelf',
            itemCount: 25,
            temperatureControlled: false,
            requiresKeyAccess: false,
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            name: 'Refrigerator',
            description: 'Temperature-sensitive medications',
            type: 'refrigerator',
            itemCount: 8,
            temperatureControlled: true,
            requiresKeyAccess: true,
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '3',
            name: 'Locked Cabinet',
            description: 'Controlled substances',
            type: 'locked',
            itemCount: 5,
            temperatureControlled: false,
            requiresKeyAccess: true,
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
          },
        ];

        setLocations(mockLocations);
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving location:', formData);
    setIsAddingNew(false);
    setFormData({
      name: '',
      description: '',
      type: 'cabinet',
      temperatureControlled: false,
      requiresKeyAccess: false,
    });
  };

  const getLocationIcon = (type: string) => {
    const icons: Record<string, string> = {
      cabinet: '🗄️',
      shelf: '📚',
      room: '🏥',
      refrigerator: '❄️',
      locked: '🔐',
      other: '📦',
    };
    return icons[type] || '📦';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Storage Locations</h1>
          <p className="text-gray-600 mt-2">Manage physical storage locations for inventory</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Location
        </button>
      </div>

      {isAddingNew && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Location</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cabinet">Cabinet</option>
                  <option value="shelf">Shelf</option>
                  <option value="room">Room</option>
                  <option value="refrigerator">Refrigerator</option>
                  <option value="locked">Locked Storage</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.temperatureControlled}
                  onChange={(e) => setFormData({ ...formData, temperatureControlled: e.target.checked })}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Temperature Controlled</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.requiresKeyAccess}
                  onChange={(e) => setFormData({ ...formData, requiresKeyAccess: e.target.checked })}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Requires Key Access</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {locations.length === 0 ? (
        <EmptyState
          icon="📍"
          title="No locations"
          description="Create your first storage location to organize inventory"
          action={{ label: "Add Location", onClick: () => setIsAddingNew(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getLocationIcon(location.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{location.type}</p>
                  </div>
                </div>
              </div>

              {location.description && (
                <p className="text-sm text-gray-600 mb-4">{location.description}</p>
              )}

              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items stored:</span>
                  <span className="font-bold text-gray-900">{location.itemCount}</span>
                </div>
                {location.temperatureControlled && (
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <span>❄️</span>
                    <span>Temperature Controlled</span>
                  </div>
                )}
                {location.requiresKeyAccess && (
                  <div className="flex items-center gap-1 text-sm text-orange-600">
                    <span>🔐</span>
                    <span>Key Access Required</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.location.href = `/inventory?location=${location.id}`}
                  className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors"
                >
                  View Items
                </button>
                <button className="flex-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Export both named and default for flexibility
export { InventoryLocationsContent }
export default InventoryLocationsContent
