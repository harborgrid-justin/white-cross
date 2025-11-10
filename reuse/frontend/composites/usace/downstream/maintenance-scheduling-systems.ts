/**
 * LOC: USACE-DOWNSTREAM-MSS-001
 * File: /reuse/frontend/composites/usace/downstream/maintenance-scheduling-systems.ts
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  useMaintenanceSchedule,
  useWorkOrders,
  generateMaintenanceSchedules,
  type MaintenanceSchedule,
  type WorkOrder,
} from '../usace-equipment-tracking-composites';

export function MaintenanceSchedulingDashboard({
  equipmentId,
  onWorkOrderCreate,
}: {
  equipmentId: string;
  onWorkOrderCreate?: (workOrder: WorkOrder) => void;
}) {
  const {
    schedules,
    overdueSchedules,
    upcomingSchedules,
    createSchedule,
    updateSchedule,
  } = useMaintenanceSchedule(equipmentId);

  const {
    workOrders,
    openWorkOrders,
    emergencyWorkOrders,
    createWorkOrder,
  } = useWorkOrders(equipmentId);

  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="maintenance-scheduling-dashboard p-6">
      <h2 className="text-2xl font-bold mb-4">Maintenance Scheduling</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Schedules</div>
          <div className="text-3xl font-bold">{schedules.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Overdue</div>
          <div className="text-3xl font-bold text-red-600">{overdueSchedules.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Upcoming</div>
          <div className="text-3xl font-bold text-orange-600">{upcomingSchedules.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Open Work Orders</div>
          <div className="text-3xl font-bold text-blue-600">{openWorkOrders.length}</div>
        </div>
      </div>

      {overdueSchedules.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="font-bold text-red-800">Attention Required</div>
          <div className="text-red-700">
            You have {overdueSchedules.length} overdue maintenance schedule(s)
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Maintenance Schedules</h3>
        <div className="space-y-4">
          {schedules.map(schedule => {
            const isOverdue = overdueSchedules.some(s => s.scheduleId === schedule.scheduleId);
            const isUpcoming = upcomingSchedules.some(s => s.scheduleId === schedule.scheduleId);

            return (
              <div
                key={schedule.scheduleId}
                className={`p-4 border-2 rounded-lg ${
                  isOverdue ? 'border-red-500 bg-red-50' :
                  isUpcoming ? 'border-orange-500 bg-orange-50' :
                  'border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">{schedule.taskName}</div>
                    <div className="text-sm text-gray-600">{schedule.maintenanceType.replace('_', ' ')}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-sm ${
                    schedule.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    schedule.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {schedule.priority.toUpperCase()}
                  </div>
                </div>

                <div className="text-sm text-gray-700 mb-2">{schedule.description}</div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Frequency:</span>
                    <div className="font-medium">{schedule.frequency.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Due:</span>
                    <div className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                      {schedule.nextDueDate.toLocaleDateString()}
                      {isOverdue && ' (OVERDUE)'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Estimated Duration:</span>
                    <div className="font-medium">{schedule.estimatedDuration} hrs</div>
                  </div>
                </div>

                {(isOverdue || isUpcoming) && (
                  <button
                    onClick={() => {
                      createWorkOrder({
                        equipmentId,
                        equipmentNumber: 'EQ-001',
                        orderType: 'preventive_maintenance',
                        priority: schedule.priority === 'critical' ? 'urgent' : 'medium',
                        problemDescription: `Scheduled ${schedule.taskName}`,
                        requestedBy: 'Current User',
                        estimatedCost: schedule.estimatedCost || 0,
                        actualCost: 0,
                        laborHours: 0,
                        partsUsed: [],
                        downtime: 0,
                        approval: [],
                        attachments: [],
                        notes: '',
                      });
                    }}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Create Work Order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Work Orders ({openWorkOrders.length})</h3>
        <div className="space-y-3">
          {openWorkOrders.slice(0, 5).map(wo => (
            <div key={wo.workOrderId} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium">{wo.workOrderNumber}</div>
                <div className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  {wo.status.toUpperCase().replace('_', ' ')}
                </div>
              </div>
              <div className="text-sm text-gray-700">{wo.problemDescription}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default { MaintenanceSchedulingDashboard };
