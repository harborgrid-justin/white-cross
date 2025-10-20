/**
 * WF-COMP-118 | WitnessStatementContext.example.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./WitnessStatementContext, ../types/incidents | Dependencies: react-hook-form, ./WitnessStatementContext, ../types/incidents
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: named exports | Key Features: useState, component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Witness Statement Context Usage Examples
 *
 * This file demonstrates various patterns for using the WitnessStatementContext
 * in real-world scenarios within the incident report detail pages.
 *
 * @example
 * These examples show:
 * - Basic CRUD operations
 * - Form integration with React Hook Form
 * - Optimistic UI updates
 * - Error handling
 * - Loading states
 * - Verification workflows
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  WitnessStatementProvider,
  useWitnessStatements
} from '../contexts/WitnessStatementContext';
import type { WitnessStatementFormData } from '../types/incidents';
import { WitnessType } from '../types/incidents';

// ==========================================
// EXAMPLE 1: Basic Witness Statement List
// ==========================================

/**
 * Simple witness statement list component
 * Displays all statements with loading and error states
 */
function WitnessStatementList() {
  const { statements, isLoading, error, deleteWitnessStatement, verifyStatement } = useWitnessStatements();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading witness statements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading statements: {error.message}</p>
      </div>
    );
  }

  if (statements.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No witness statements recorded yet.</p>
        <p className="text-sm text-gray-500 mt-2">
          Add witness statements to document accounts of the incident.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {statements.map((statement) => (
        <div
          key={statement.id}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {statement.witnessName}
              </h3>
              <p className="text-sm text-gray-600">
                {statement.witnessType} {statement.witnessContact && `• ${statement.witnessContact}`}
              </p>
            </div>
            {statement.verified ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                Pending Verification
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-4">{statement.statement}</p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Added: {new Date(statement.createdAt).toLocaleDateString()}
              {statement.verifiedAt && (
                <> • Verified: {new Date(statement.verifiedAt).toLocaleDateString()}</>
              )}
            </div>
            <div className="flex space-x-2">
              {!statement.verified && (
                <button
                  onClick={() => verifyStatement(statement.id)}
                  className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
                >
                  Verify
                </button>
              )}
              <button
                onClick={() => deleteWitnessStatement(statement.id)}
                className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// EXAMPLE 2: Create Statement Form
// ==========================================

/**
 * Form for creating new witness statements
 * Integrates with React Hook Form for validation
 */
function CreateWitnessStatementForm({ incidentId }: { incidentId: string }) {
  const { createWitnessStatement, operationLoading } = useWitnessStatements();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<WitnessStatementFormData>();

  const onSubmit = async (data: WitnessStatementFormData) => {
    try {
      await createWitnessStatement({
        incidentReportId: incidentId,
        ...data,
      });
      reset();
      setIsFormVisible(false);
    } catch (error) {
      console.error('Failed to create statement:', error);
    }
  };

  if (!isFormVisible) {
    return (
      <button
        onClick={() => setIsFormVisible(true)}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Witness Statement
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">New Witness Statement</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Witness Name */}
        <div>
          <label htmlFor="witnessName" className="block text-sm font-medium text-gray-700 mb-1">
            Witness Name *
          </label>
          <input
            id="witnessName"
            type="text"
            {...register('witnessName', { required: 'Witness name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter witness name"
          />
          {errors.witnessName && (
            <p className="mt-1 text-sm text-red-600">{errors.witnessName.message}</p>
          )}
        </div>

        {/* Witness Type */}
        <div>
          <label htmlFor="witnessType" className="block text-sm font-medium text-gray-700 mb-1">
            Witness Type *
          </label>
          <select
            id="witnessType"
            {...register('witnessType', { required: 'Witness type is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select type</option>
            <option value={WitnessType.STUDENT}>Student</option>
            <option value={WitnessType.STAFF}>Staff</option>
            <option value={WitnessType.PARENT}>Parent/Guardian</option>
            <option value={WitnessType.OTHER}>Other</option>
          </select>
          {errors.witnessType && (
            <p className="mt-1 text-sm text-red-600">{errors.witnessType.message}</p>
          )}
        </div>

        {/* Contact Information */}
        <div>
          <label htmlFor="witnessContact" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Information
          </label>
          <input
            id="witnessContact"
            type="text"
            {...register('witnessContact')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Email or phone number"
          />
        </div>

        {/* Statement */}
        <div>
          <label htmlFor="statement" className="block text-sm font-medium text-gray-700 mb-1">
            Statement *
          </label>
          <textarea
            id="statement"
            {...register('statement', { required: 'Statement is required' })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter witness statement..."
          />
          {errors.statement && (
            <p className="mt-1 text-sm text-red-600">{errors.statement.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={operationLoading.create}
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {operationLoading.create ? 'Adding...' : 'Add Statement'}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setIsFormVisible(false);
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// EXAMPLE 3: Edit Statement Modal
// ==========================================

/**
 * Modal for editing existing witness statements
 * Demonstrates update operations with optimistic UI
 */
function EditWitnessStatementModal() {
  const {
    selectedStatement,
    updateWitnessStatement,
    clearSelectedStatement,
    operationLoading
  } = useWitnessStatements();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<WitnessStatementFormData>({
    defaultValues: selectedStatement || undefined,
  });

  if (!selectedStatement) return null;

  const onSubmit = async (data: WitnessStatementFormData) => {
    try {
      await updateWitnessStatement(selectedStatement.id, data);
    } catch (error) {
      console.error('Failed to update statement:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Edit Witness Statement</h2>
            <button
              onClick={clearSelectedStatement}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Witness Name *
              </label>
              <input
                type="text"
                {...register('witnessName', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statement *
              </label>
              <textarea
                {...register('statement', { required: true })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={operationLoading.update}
                className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {operationLoading.update ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={clearSelectedStatement}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// EXAMPLE 4: Complete Incident Detail Page
// ==========================================

/**
 * Complete incident detail page with witness statements
 * Shows how to integrate the context provider at the page level
 */
function IncidentDetailPage({ incidentId }: { incidentId: string }) {
  return (
    <WitnessStatementProvider incidentId={incidentId}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Incident Report Details</h1>
          <p className="text-gray-600 mt-2">Incident ID: {incidentId}</p>
        </div>

        {/* Other incident details sections */}
        <div className="space-y-8">
          {/* Witness Statements Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Witness Statements</h2>

            <div className="space-y-4">
              <WitnessStatementList />
              <CreateWitnessStatementForm incidentId={incidentId} />
            </div>
          </section>
        </div>

        {/* Edit Modal */}
        <EditWitnessStatementModal />
      </div>
    </WitnessStatementProvider>
  );
}

// ==========================================
// EXAMPLE 5: Verification Workflow
// ==========================================

/**
 * Component showing verification workflow with bulk operations
 */
function WitnessStatementVerificationPanel() {
  const {
    statements,
    verifyStatement,
    unverifyStatement,
    operationLoading
  } = useWitnessStatements();

  const unverifiedStatements = statements.filter(s => !s.verified);
  const verifiedStatements = statements.filter(s => s.verified);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pending Verification */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">
          Pending Verification ({unverifiedStatements.length})
        </h3>
        <div className="space-y-3">
          {unverifiedStatements.map(statement => (
            <div key={statement.id} className="bg-white p-4 rounded-lg">
              <p className="font-medium text-gray-900">{statement.witnessName}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{statement.statement}</p>
              <button
                onClick={() => verifyStatement(statement.id)}
                disabled={operationLoading.verify}
                className="mt-3 w-full py-2 px-4 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50"
              >
                Verify Statement
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Verified */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4">
          Verified ({verifiedStatements.length})
        </h3>
        <div className="space-y-3">
          {verifiedStatements.map(statement => (
            <div key={statement.id} className="bg-white p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{statement.witnessName}</p>
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{statement.statement}</p>
              {statement.verifiedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Verified: {new Date(statement.verifiedAt).toLocaleDateString()}
                </p>
              )}
              <button
                onClick={() => unverifyStatement(statement.id)}
                disabled={operationLoading.verify}
                className="mt-3 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Unverify
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// EXAMPLE 6: Inline Loading States
// ==========================================

/**
 * Component demonstrating granular loading states
 */
function WitnessStatementCard({ statementId }: { statementId: string }) {
  const {
    statements,
    deleteWitnessStatement,
    verifyStatement,
    operationLoading
  } = useWitnessStatements();

  const statement = statements.find(s => s.id === statementId);

  if (!statement) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="font-medium">{statement.witnessName}</p>
      <p className="text-sm text-gray-600 mt-2">{statement.statement}</p>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => verifyStatement(statement.id)}
          disabled={operationLoading.verify}
          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
        >
          {operationLoading.verify ? 'Verifying...' : 'Verify'}
        </button>
        <button
          onClick={() => deleteWitnessStatement(statement.id)}
          disabled={operationLoading.delete}
          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
        >
          {operationLoading.delete ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// EXPORTS
// ==========================================

export {
  WitnessStatementList,
  CreateWitnessStatementForm,
  EditWitnessStatementModal,
  IncidentDetailPage,
  WitnessStatementVerificationPanel,
  WitnessStatementCard,
};
