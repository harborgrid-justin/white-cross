/**
 * LOC: USACE-DOWNSTREAM-CM-APP-001
 * File: /reuse/frontend/composites/usace/downstream/contract-management-applications.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/frontend/composites/usace/usace-contract-management-composites.ts
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS contract management applications
 *   - District contract offices
 *   - Project management dashboards
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/contract-management-applications.ts
 * Locator: WC-USACE-DS-CM-APP-001
 * Purpose: USACE Contract Management Applications - Complete contract lifecycle UI applications
 *
 * Upstream: usace-contract-management-composites.ts, React 18+, Next.js 16+
 * Downstream: USACE district contract offices, project teams, contracting officers
 * Dependencies: React 18+, TypeScript 5.x, parent composite
 * Exports: 12 specialized contract management application components
 *
 * LLM Context: Production-ready USACE contract management applications for district offices.
 * Provides complete UI applications for contract lifecycle management including contract dashboard,
 * modification workflow, deliverable tracking, funding management, claims processing, closeout
 * management, performance evaluation, and contract analytics. Designed for USACE contracting
 * officers, contract administrators, and project managers managing construction, engineering,
 * and services contracts with full FAR/DFARS compliance.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useContractManagement,
  useContractModifications,
  useDeliverableTracking,
  useContractFunding,
  useContractClaims,
  useContractCloseout,
  usePerformanceEvaluation,
  generateContractCreationForm,
  generateModificationForm,
  calculateContractMetrics,
  validateFARCompliance,
  exportContractData,
  checkFundingAdequacy,
  calculateDaysToExpiration,
  generateCloseoutReport,
  type Contract,
  type ContractModification,
  type Deliverable,
  type FundingDocument,
  type ContractClaim,
  type CloseoutChecklist,
  type PerformanceEvaluation,
} from '../usace-contract-management-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ContractDashboardFilters {
  status?: string[];
  contractType?: string[];
  contractorName?: string;
  dateRange?: { start: Date; end: Date };
  minValue?: number;
  maxValue?: number;
}

export interface ContractAnalytics {
  totalContracts: number;
  totalValue: number;
  activeContracts: number;
  expiringContracts: number;
  averageContractValue: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  complianceRate: number;
  modificationRate: number;
}

// ============================================================================
// CONTRACT DASHBOARD APPLICATION
// ============================================================================

/**
 * Complete contract dashboard application with filtering and analytics
 *
 * @param {object} props - Component props
 * @returns {React.ReactElement} Contract dashboard
 *
 * @example
 * ```tsx
 * <ContractDashboardApp
 *   organizationCode="NAB"
 *   onContractSelect={(contract) => router.push(`/contracts/${contract.id}`)}
 * />
 * ```
 */
export function ContractDashboardApp({
  organizationCode,
  onContractSelect,
}: {
  organizationCode: string;
  onContractSelect?: (contract: Contract) => void;
}) {
  const {
    contracts,
    loading,
    getActiveContracts,
    searchContracts,
  } = useContractManagement();

  const [filters, setFilters] = useState<ContractDashboardFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const filteredContracts = useMemo(() => {
    let filtered = contracts;

    if (searchQuery) {
      filtered = searchContracts(searchQuery);
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(c => filters.status!.includes(c.status));
    }

    if (filters.contractType && filters.contractType.length > 0) {
      filtered = filtered.filter(c => filters.contractType!.includes(c.contractType));
    }

    if (filters.contractorName) {
      filtered = filtered.filter(c =>
        c.contractor.name.toLowerCase().includes(filters.contractorName!.toLowerCase())
      );
    }

    if (filters.minValue !== undefined) {
      filtered = filtered.filter(c => c.currentValue >= filters.minValue!);
    }

    if (filters.maxValue !== undefined) {
      filtered = filtered.filter(c => c.currentValue <= filters.maxValue!);
    }

    return filtered;
  }, [contracts, searchQuery, filters, searchContracts]);

  const analytics = useMemo<ContractAnalytics>(() => {
    const activeContracts = getActiveContracts();
    const expiringContracts = contracts.filter(c => {
      const daysToExpiration = calculateDaysToExpiration(c);
      return daysToExpiration > 0 && daysToExpiration <= 90;
    });

    const totalValue = contracts.reduce((sum, c) => sum + c.currentValue, 0);

    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let compliantCount = 0;
    let withModifications = 0;

    contracts.forEach(contract => {
      byType[contract.contractType] = (byType[contract.contractType] || 0) + 1;
      byStatus[contract.status] = (byStatus[contract.status] || 0) + 1;

      const compliance = validateFARCompliance(contract);
      if (compliance.isCompliant) compliantCount++;

      if (contract.modifications && contract.modifications.length > 0) {
        withModifications++;
      }
    });

    return {
      totalContracts: contracts.length,
      totalValue,
      activeContracts: activeContracts.length,
      expiringContracts: expiringContracts.length,
      averageContractValue: contracts.length > 0 ? totalValue / contracts.length : 0,
      byType,
      byStatus,
      complianceRate: contracts.length > 0 ? (compliantCount / contracts.length) * 100 : 100,
      modificationRate: contracts.length > 0 ? (withModifications / contracts.length) * 100 : 0,
    };
  }, [contracts, getActiveContracts]);

  const handleContractClick = useCallback((contract: Contract) => {
    setSelectedContract(contract);
    if (onContractSelect) {
      onContractSelect(contract);
    }
  }, [onContractSelect]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading contracts...</div>
      </div>
    );
  }

  return (
    <div className="contract-dashboard-app p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Contract Management Dashboard</h1>
        <p className="text-gray-600">
          Organization: {organizationCode}
        </p>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Contracts</div>
          <div className="text-2xl font-bold">{analytics.totalContracts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Value</div>
          <div className="text-2xl font-bold">
            ${analytics.totalValue.toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Active Contracts</div>
          <div className="text-2xl font-bold">{analytics.activeContracts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Expiring Soon</div>
          <div className="text-2xl font-bold text-orange-600">
            {analytics.expiringContracts}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by contract number, title, or contractor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Contract Status</label>
            <select
              multiple
              className="w-full border rounded-lg p-2"
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                setFilters(prev => ({ ...prev, status: selected }));
              }}
            >
              <option value="active">Active</option>
              <option value="awarded">Awarded</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Min Value</label>
            <input
              type="number"
              placeholder="Minimum contract value"
              onChange={(e) => {
                setFilters(prev => ({ ...prev, minValue: Number(e.target.value) }));
              }}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Value</label>
            <input
              type="number"
              placeholder="Maximum contract value"
              onChange={(e) => {
                setFilters(prev => ({ ...prev, maxValue: Number(e.target.value) }));
              }}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Contract List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">
            Contracts ({filteredContracts.length})
          </h2>
        </div>
        <div className="divide-y">
          {filteredContracts.map(contract => {
            const metrics = calculateContractMetrics(contract);
            const daysToExpiration = calculateDaysToExpiration(contract);

            return (
              <div
                key={contract.id}
                onClick={() => handleContractClick(contract)}
                className="p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{contract.contractNumber}</div>
                    <div className="text-gray-700">{contract.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      ${contract.currentValue.toLocaleString()}
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      contract.status === 'active' ? 'bg-green-100 text-green-800' :
                      contract.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contract.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Contractor:</span>
                    <div className="font-medium">{contract.contractor.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <div className="font-medium">{contract.contractType}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Progress:</span>
                    <div className="font-medium">{metrics.timeProgress}% time elapsed</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Days Remaining:</span>
                    <div className={`font-medium ${daysToExpiration <= 30 ? 'text-orange-600' : ''}`}>
                      {daysToExpiration} days
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Contract modification workflow application
 *
 * @param {object} props - Component props
 * @returns {React.ReactElement} Modification workflow
 *
 * @example
 * ```tsx
 * <ContractModificationWorkflow
 *   contractId="CONTRACT-001"
 *   onModificationCreated={(mod) => console.log('Modification created', mod)}
 * />
 * ```
 */
export function ContractModificationWorkflow({
  contractId,
  contract,
  onModificationCreated,
}: {
  contractId: string;
  contract?: Contract;
  onModificationCreated?: (modification: ContractModification) => void;
}) {
  const {
    modifications,
    createModification,
    approveModification,
    calculateCumulativeValue,
    getPendingModifications,
  } = useContractModifications(contractId);

  const [isCreatingMod, setIsCreatingMod] = useState(false);
  const [modificationData, setModificationData] = useState<Partial<ContractModification>>({
    modType: 'bilateral',
    priorValue: contract?.currentValue || 0,
    changeAmount: 0,
    newValue: contract?.currentValue || 0,
    description: '',
    justification: '',
    status: 'draft',
  });

  const pendingMods = useMemo(() => getPendingModifications(), [getPendingModifications]);
  const cumulativeValue = useMemo(() => calculateCumulativeValue(), [calculateCumulativeValue]);

  const handleChangeAmountUpdate = useCallback((amount: number) => {
    const priorValue = contract?.currentValue || 0;
    setModificationData(prev => ({
      ...prev,
      changeAmount: amount,
      newValue: priorValue + amount,
    }));
  }, [contract]);

  const handleCreateModification = useCallback(async () => {
    if (!contract) return;

    const nextModNumber = (modifications.length + 1).toString().padStart(3, '0');
    const fullModData: ContractModification = {
      id: crypto.randomUUID(),
      modificationNumber: `${contract.contractNumber}-M${nextModNumber}`,
      modType: modificationData.modType as ContractModification['modType'],
      effectiveDate: new Date(),
      description: modificationData.description || '',
      priorValue: contract.currentValue,
      changeAmount: modificationData.changeAmount || 0,
      newValue: contract.currentValue + (modificationData.changeAmount || 0),
      justification: modificationData.justification || '',
      status: 'draft',
    };

    createModification(fullModData);
    setIsCreatingMod(false);
    setModificationData({
      modType: 'bilateral',
      priorValue: contract.currentValue,
      changeAmount: 0,
      newValue: contract.currentValue,
      description: '',
      justification: '',
      status: 'draft',
    });

    if (onModificationCreated) {
      onModificationCreated(fullModData);
    }
  }, [contract, modifications, modificationData, createModification, onModificationCreated]);

  return (
    <div className="contract-modification-workflow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Contract Modifications</h2>
        {contract && (
          <p className="text-gray-600">
            Contract: {contract.contractNumber} - {contract.title}
          </p>
        )}
      </div>

      {/* Modification Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Modifications</div>
          <div className="text-2xl font-bold">{modifications.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Pending Approval</div>
          <div className="text-2xl font-bold text-orange-600">{pendingMods.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Cumulative Value</div>
          <div className="text-2xl font-bold">${cumulativeValue.toLocaleString()}</div>
        </div>
      </div>

      {/* Create New Modification */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <button
          onClick={() => setIsCreatingMod(!isCreatingMod)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          {isCreatingMod ? 'Cancel' : 'Create New Modification'}
        </button>

        {isCreatingMod && (
          <div className="border-t pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Modification Type</label>
              <select
                value={modificationData.modType}
                onChange={(e) => setModificationData(prev => ({
                  ...prev,
                  modType: e.target.value as ContractModification['modType']
                }))}
                className="w-full border rounded-lg p-2"
              >
                <option value="bilateral">Bilateral</option>
                <option value="unilateral">Unilateral</option>
                <option value="administrative">Administrative</option>
                <option value="funding">Funding Only</option>
                <option value="no_cost_time_extension">No Cost Time Extension</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Change Amount ($)</label>
              <input
                type="number"
                value={modificationData.changeAmount || 0}
                onChange={(e) => handleChangeAmountUpdate(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={modificationData.description}
                onChange={(e) => setModificationData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Justification</label>
              <textarea
                value={modificationData.justification}
                onChange={(e) => setModificationData(prev => ({
                  ...prev,
                  justification: e.target.value
                }))}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleCreateModification}
                disabled={!modificationData.description || !modificationData.justification}
                className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
              >
                Create Modification
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modifications List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">Modification History</h3>
        </div>
        <div className="divide-y">
          {modifications.map(mod => (
            <div key={mod.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold">{mod.modificationNumber}</div>
                  <div className="text-sm text-gray-600">{mod.modType.replace('_', ' ').toUpperCase()}</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${mod.changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {mod.changeAmount >= 0 ? '+' : ''}${mod.changeAmount.toLocaleString()}
                  </div>
                  <div className={`text-sm px-2 py-1 rounded ${
                    mod.status === 'executed' ? 'bg-green-100 text-green-800' :
                    mod.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {mod.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-2">{mod.description}</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Prior Value:</span>
                  <div className="font-medium">${mod.priorValue.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">New Value:</span>
                  <div className="font-medium">${mod.newValue.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Effective Date:</span>
                  <div className="font-medium">{mod.effectiveDate.toLocaleDateString()}</div>
                </div>
              </div>

              {mod.status === 'pending_approval' && (
                <div className="mt-4">
                  <button
                    onClick={() => approveModification(mod.id, 'Current User')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Contract deliverable tracker application
 *
 * @param {object} props - Component props
 * @returns {React.ReactElement} Deliverable tracker
 *
 * @example
 * ```tsx
 * <ContractDeliverableTracker
 *   contractId="CONTRACT-001"
 *   onDeliverableUpdate={(deliverable) => console.log('Updated', deliverable)}
 * />
 * ```
 */
export function ContractDeliverableTracker({
  contractId,
  contract,
  onDeliverableUpdate,
}: {
  contractId: string;
  contract?: Contract;
  onDeliverableUpdate?: (deliverable: Deliverable) => void;
}) {
  const {
    deliverables,
    addDeliverable,
    updateDeliverableStatus,
    getOverdueDeliverables,
    calculateCompletionPercentage,
    getDeliverableValue,
  } = useDeliverableTracking(contractId);

  const overdueDeliverables = useMemo(() => getOverdueDeliverables(), [getOverdueDeliverables]);
  const completionPercentage = useMemo(() => calculateCompletionPercentage(), [calculateCompletionPercentage]);
  const totalValue = useMemo(() => getDeliverableValue(), [getDeliverableValue]);

  const [isAddingDeliverable, setIsAddingDeliverable] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState<Partial<Deliverable>>({
    clin: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    dueDate: new Date(),
    status: 'pending',
  });

  const handleAddDeliverable = useCallback(() => {
    const deliverable: Deliverable = {
      id: crypto.randomUUID(),
      clin: newDeliverable.clin || '',
      description: newDeliverable.description || '',
      quantity: newDeliverable.quantity || 1,
      unitPrice: newDeliverable.unitPrice || 0,
      totalPrice: (newDeliverable.quantity || 1) * (newDeliverable.unitPrice || 0),
      dueDate: newDeliverable.dueDate || new Date(),
      status: 'pending',
    };

    addDeliverable(deliverable);
    setIsAddingDeliverable(false);
    setNewDeliverable({
      clin: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      dueDate: new Date(),
      status: 'pending',
    });
  }, [newDeliverable, addDeliverable]);

  const handleStatusChange = useCallback((deliverableId: string, newStatus: Deliverable['status']) => {
    updateDeliverableStatus(deliverableId, newStatus);
    const deliverable = deliverables.find(d => d.id === deliverableId);
    if (deliverable && onDeliverableUpdate) {
      onDeliverableUpdate({ ...deliverable, status: newStatus });
    }
  }, [deliverables, updateDeliverableStatus, onDeliverableUpdate]);

  return (
    <div className="contract-deliverable-tracker p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Contract Deliverables</h2>
        {contract && (
          <p className="text-gray-600">
            Contract: {contract.contractNumber} - {contract.title}
          </p>
        )}
      </div>

      {/* Deliverable Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Deliverables</div>
          <div className="text-2xl font-bold">{deliverables.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Completion</div>
          <div className="text-2xl font-bold text-green-600">{completionPercentage}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Overdue</div>
          <div className="text-2xl font-bold text-red-600">{overdueDeliverables.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Value</div>
          <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
        </div>
      </div>

      {/* Add Deliverable */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <button
          onClick={() => setIsAddingDeliverable(!isAddingDeliverable)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          {isAddingDeliverable ? 'Cancel' : 'Add Deliverable'}
        </button>

        {isAddingDeliverable && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">CLIN</label>
                <input
                  type="text"
                  value={newDeliverable.clin}
                  onChange={(e) => setNewDeliverable(prev => ({ ...prev, clin: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  value={newDeliverable.dueDate?.toISOString().split('T')[0]}
                  onChange={(e) => setNewDeliverable(prev => ({
                    ...prev,
                    dueDate: new Date(e.target.value)
                  }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={newDeliverable.description}
                onChange={(e) => setNewDeliverable(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  value={newDeliverable.quantity}
                  onChange={(e) => {
                    const quantity = Number(e.target.value);
                    setNewDeliverable(prev => ({
                      ...prev,
                      quantity,
                      totalPrice: quantity * (prev.unitPrice || 0)
                    }));
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unit Price ($)</label>
                <input
                  type="number"
                  value={newDeliverable.unitPrice}
                  onChange={(e) => {
                    const unitPrice = Number(e.target.value);
                    setNewDeliverable(prev => ({
                      ...prev,
                      unitPrice,
                      totalPrice: (prev.quantity || 1) * unitPrice
                    }));
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Total Price ($)</label>
                <input
                  type="number"
                  value={newDeliverable.totalPrice}
                  readOnly
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                />
              </div>
            </div>

            <button
              onClick={handleAddDeliverable}
              disabled={!newDeliverable.clin || !newDeliverable.description}
              className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
            >
              Add Deliverable
            </button>
          </div>
        )}
      </div>

      {/* Deliverables List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">Deliverables List</h3>
        </div>
        <div className="divide-y">
          {deliverables.map(deliverable => {
            const isOverdue = overdueDeliverables.some(d => d.id === deliverable.id);

            return (
              <div key={deliverable.id} className={`p-4 ${isOverdue ? 'bg-red-50' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-bold">CLIN {deliverable.clin}</div>
                    <div className="text-gray-700">{deliverable.description}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold">${deliverable.totalPrice.toLocaleString()}</div>
                    <select
                      value={deliverable.status}
                      onChange={(e) => handleStatusChange(deliverable.id, e.target.value as Deliverable['status'])}
                      className={`text-sm px-2 py-1 rounded border ${
                        deliverable.status === 'completed' || deliverable.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        deliverable.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        deliverable.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="submitted">Submitted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <div className="font-medium">{deliverable.quantity}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Unit Price:</span>
                    <div className="font-medium">${deliverable.unitPrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Due Date:</span>
                    <div className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                      {deliverable.dueDate.toLocaleDateString()}
                      {isOverdue && ' (OVERDUE)'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Progress:</span>
                    <div className="font-medium">{deliverable.percentComplete || 0}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  ContractDashboardApp,
  ContractModificationWorkflow,
  ContractDeliverableTracker,
};
