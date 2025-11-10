/**
 * LOC: USACE-DOWNSTREAM-EUD-001
 * File: /reuse/frontend/composites/usace/downstream/equipment-utilization-dashboards.ts
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  useEquipmentUtilization,
  calculateUtilizationRate,
  calculateReliabilityMetrics,
  generateEquipmentAnalytics,
  type Equipment,
  type EquipmentUtilization,
  type WorkOrder,
} from '../usace-equipment-tracking-composites';

export function EquipmentUtilizationDashboard({
  equipmentId,
  period,
  equipment,
  workOrders,
}: {
  equipmentId: string;
  period: string;
  equipment?: Equipment;
  workOrders?: WorkOrder[];
}) {
  const { utilization, loading, refreshUtilization } = useEquipmentUtilization(equipmentId, period);

  const utilizationMetrics = useMemo(() => {
    if (!utilization) return null;
    return calculateUtilizationRate(utilization.operationalHours, utilization.availableHours);
  }, [utilization]);

  const reliabilityMetrics = useMemo(() => {
    if (!workOrders) return null;
    return calculateReliabilityMetrics(workOrders, utilization?.availableHours || 720);
  }, [workOrders, utilization]);

  if (loading) return <div className="p-4">Loading utilization data...</div>;
  if (!utilization) return <div className="p-4">No utilization data available</div>;

  return (
    <div className="equipment-utilization-dashboard p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Equipment Utilization</h2>
        {equipment && (
          <p className="text-gray-600">{equipment.equipmentNumber} - {equipment.name}</p>
        )}
        <p className="text-sm text-gray-500">Period: {period}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Utilization Rate</div>
          <div className={`text-3xl font-bold ${
            utilizationMetrics && utilizationMetrics.utilizationRate >= 80 ? 'text-green-600' :
            utilizationMetrics && utilizationMetrics.utilizationRate >= 60 ? 'text-blue-600' :
            'text-orange-600'
          }`}>
            {utilizationMetrics?.utilizationRate.toFixed(1)}%
          </div>
          {utilizationMetrics && (
            <div className="text-xs text-gray-500 mt-1">{utilizationMetrics.efficiency}</div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Operational Hours</div>
          <div className="text-3xl font-bold">{utilization.operationalHours}</div>
          <div className="text-xs text-gray-500">of {utilization.availableHours} available</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Downtime</div>
          <div className="text-3xl font-bold text-red-600">{utilization.downtime} hrs</div>
          <div className="text-xs text-gray-500">Maintenance: {utilization.maintenanceHours} hrs</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Cost Per Hour</div>
          <div className="text-3xl font-bold">${utilization.costPerHour.toFixed(2)}</div>
          {utilization.fuelCost && (
            <div className="text-xs text-gray-500">Fuel: ${utilization.fuelCost.toFixed(2)}</div>
          )}
        </div>
      </div>

      {reliabilityMetrics && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-bold mb-4">Reliability Metrics</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">MTBF</div>
              <div className="text-2xl font-bold text-blue-600">
                {reliabilityMetrics.mtbf?.toFixed(1)} hrs
              </div>
              <div className="text-xs text-gray-500">Mean Time Between Failures</div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">MTTR</div>
              <div className="text-2xl font-bold text-green-600">
                {reliabilityMetrics.mttr?.toFixed(1)} hrs
              </div>
              <div className="text-xs text-gray-500">Mean Time To Repair</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Availability</div>
              <div className="text-2xl font-bold text-purple-600">
                {reliabilityMetrics.availability?.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Equipment Availability</div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600">Reliability Score</div>
              <div className="text-2xl font-bold text-orange-600">
                {reliabilityMetrics.reliabilityScore}/100
              </div>
              <div className="text-xs text-gray-500">Overall Rating</div>
            </div>
          </div>
        </div>
      )}

      {utilization.projects && utilization.projects.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Project Allocation</h3>
          <div className="space-y-3">
            {utilization.projects.map((project, idx) => {
              const percentage = (project.hours / utilization.operationalHours) * 100;

              return (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{project.projectCode}</span>
                    <span className="text-sm">
                      {project.hours} hrs ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Cost: ${project.costAllocated.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default { EquipmentUtilizationDashboard };
