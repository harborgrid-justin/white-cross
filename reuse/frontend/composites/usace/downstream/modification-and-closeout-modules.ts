/**
 * LOC: USACE-DOWNSTREAM-MCM-001
 * File: /reuse/frontend/composites/usace/downstream/modification-and-closeout-modules.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/frontend/composites/usace/usace-contract-management-composites.ts
 *   - React 18+, Next.js 16+, TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE modification workflow systems
 *   - Contract closeout applications
 *   - Final payment processing tools
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/modification-and-closeout-modules.ts
 * Locator: WC-USACE-DS-MCM-001
 * Purpose: Contract Modification and Closeout Processing Modules
 *
 * LLM Context: Production-ready contract modification and closeout processing for USACE.
 * Comprehensive modification tracking, closeout checklists, final payments, and contract termination.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useContractModifications,
  useContractCloseout,
  generateModificationForm,
  generateCloseoutReport,
  type Contract,
  type ContractModification,
  type CloseoutChecklist,
} from '../usace-contract-management-composites';

// ============================================================================
// MODIFICATION APPROVAL WORKFLOW
// ============================================================================

export function ModificationApprovalWorkflow({
  contractId,
  modification,
  onApproved,
  onRejected,
}: {
  contractId: string;
  modification: ContractModification;
  onApproved?: (mod: ContractModification) => void;
  onRejected?: (mod: ContractModification, reason: string) => void;
}) {
  const { approveModification } = useContractModifications(contractId);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = useCallback(() => {
    approveModification(modification.id, 'Current User');
    if (onApproved) onApproved(modification);
  }, [modification, approveModification, onApproved]);

  const handleReject = useCallback(() => {
    if (onRejected) onRejected(modification, rejectionReason);
  }, [modification, rejectionReason, onRejected]);

  return (
    <div className="modification-approval-workflow p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Modification Approval</h2>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-600">Modification Number:</span>
            <div className="font-bold">{modification.modificationNumber}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Type:</span>
            <div className="font-bold">{modification.modType}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">Change Amount:</span>
            <div className={`font-bold text-lg ${modification.changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${modification.changeAmount.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600">New Value:</span>
            <div className="font-bold text-lg">${modification.newValue.toLocaleString()}</div>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-sm text-gray-600">Description:</span>
          <div className="mt-1 p-3 bg-gray-50 rounded">{modification.description}</div>
        </div>

        <div className="mb-4">
          <span className="text-sm text-gray-600">Justification:</span>
          <div className="mt-1 p-3 bg-gray-50 rounded">{modification.justification}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Approval Notes</label>
          <textarea
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter any approval notes or conditions..."
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
          >
            Approve Modification
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reject this modification?')) {
                handleReject();
              }
            }}
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CONTRACT CLOSEOUT MANAGER
// ============================================================================

export function ContractCloseoutManager({
  contractId,
  contract,
  onCloseoutComplete,
}: {
  contractId: string;
  contract?: Contract;
  onCloseoutComplete?: () => void;
}) {
  const {
    checklist,
    initializeCloseout,
    completeItem,
    verifyCloseout,
    getCloseoutProgress,
  } = useContractCloseout(contractId);

  const progress = useMemo(() => getCloseoutProgress(), [getCloseoutProgress]);

  const handleInitialize = useCallback(() => {
    initializeCloseout();
  }, [initializeCloseout]);

  const handleComplete = useCallback((itemId: string) => {
    completeItem(itemId, 'Current User', 'Completed');
  }, [completeItem]);

  const handleVerify = useCallback(() => {
    verifyCloseout('Current User');
    if (onCloseoutComplete) {
      onCloseoutComplete();
    }
  }, [verifyCloseout, onCloseoutComplete]);

  if (!checklist) {
    return (
      <div className="contract-closeout-manager p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Contract Closeout</h2>
        <p className="mb-4">Initialize the closeout process to begin.</p>
        <button
          onClick={handleInitialize}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Initialize Closeout
        </button>
      </div>
    );
  }

  return (
    <div className="contract-closeout-manager p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Contract Closeout</h2>
        {contract && (
          <p className="text-gray-600">{contract.contractNumber} - {contract.title}</p>
        )}
      </div>

      {/* Progress Overview */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Closeout Progress</h3>
          <div className="text-3xl font-bold text-blue-600">{progress}%</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Closeout Checklist */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Closeout Checklist</h3>
        <div className="space-y-4">
          {checklist.items.map(item => (
            <div
              key={item.id}
              className={`p-4 border-2 rounded-lg ${
                item.completed ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => !item.completed && handleComplete(item.id)}
                    className="mt-1 mr-3 w-5 h-5"
                  />
                  <div className="flex-1">
                    <div className="font-bold">{item.item}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                    {item.completed && (
                      <div className="mt-2 text-sm text-green-600">
                        ✓ Completed by {item.completedBy} on {item.completedDate?.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                {item.required && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    REQUIRED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Section */}
      {progress === 100 && !checklist.verifiedBy && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Verification</h3>
          <p className="mb-4">
            All required items have been completed. Verify the closeout to finalize.
          </p>
          <button
            onClick={handleVerify}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Verify & Complete Closeout
          </button>
        </div>
      )}

      {checklist.verifiedBy && (
        <div className="bg-green-100 p-6 rounded-lg">
          <div className="text-xl font-bold text-green-800 mb-2">
            ✓ Closeout Verified
          </div>
          <div className="text-sm text-green-700">
            Verified by {checklist.verifiedBy} on {checklist.verificationDate?.toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  ModificationApprovalWorkflow,
  ContractCloseoutManager,
};
