/**
 * LOC: USACE-DOWNSTREAM-EC-001
 * File: /reuse/frontend/composites/usace/downstream/equipment-controllers.ts
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  useEquipment,
  useEquipmentCheckout,
  searchEquipment,
  generateEquipmentAnalytics,
  type Equipment,
} from '../usace-equipment-tracking-composites';

export function EquipmentInventoryController({
  equipmentId,
  onEquipmentUpdate,
}: {
  equipmentId?: string;
  onEquipmentUpdate?: (equipment: Equipment) => void;
}) {
  const {
    equipment,
    loading,
    error,
    updateEquipment,
    refreshEquipment,
  } = useEquipment(equipmentId);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Equipment>>(equipment || {});

  const handleSave = async () => {
    await updateEquipment(formData);
    setEditMode(false);
    if (onEquipmentUpdate && equipment) {
      onEquipmentUpdate({ ...equipment, ...formData });
    }
  };

  if (loading) return <div className="p-4">Loading equipment...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!equipment) return <div className="p-4">No equipment found</div>;

  return (
    <div className="equipment-inventory-controller p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Equipment Details</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {editMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {!editMode ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Equipment Number</div>
              <div className="font-bold text-lg">{equipment.equipmentNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="inline-block px-3 py-1 rounded bg-green-100 text-green-800 font-medium">
                {equipment.status.toUpperCase().replace('_', ' ')}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Name</div>
            <div className="font-bold text-xl">{equipment.name}</div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Description</div>
            <div className="text-gray-700">{equipment.description}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Category</div>
              <div className="font-medium">{equipment.category.replace('_', ' ')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Manufacturer</div>
              <div className="font-medium">{equipment.manufacturer}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Model</div>
              <div className="font-medium">{equipment.model}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Serial Number</div>
              <div className="font-medium">{equipment.serialNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Location</div>
              <div className="font-medium">{equipment.location}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Current Value</div>
              <div className="font-bold text-lg">${equipment.currentValue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Acquisition Cost</div>
              <div className="font-medium">${equipment.acquisitionCost.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Acquisition Date</div>
              <div className="font-medium">{equipment.acquisitionDate.toLocaleDateString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Condition</div>
              <div className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-800">
                {equipment.condition.toUpperCase()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Custodian</div>
              <div className="font-medium">{equipment.custodian}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Equipment['status'] })}
              className="w-full border rounded-lg p-2"
            >
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="repair">Repair</option>
              <option value="surplus">Surplus</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Condition</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value as Equipment['condition'] })}
              className="w-full border rounded-lg p-2"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="not_serviceable">Not Serviceable</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-3 rounded-lg w-full"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default { EquipmentInventoryController };
