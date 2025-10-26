/**
 * Signatures page
 *
 * @module app/documents/signatures/page
 * @description Manage signature workflows and pending signatures
 */

'use client';

import React, { useState } from 'react';
import { usePendingSignatures } from '@/hooks/documents';
import type { SignatureWorkflow } from '@/types/documents';

export default function SignaturesPage() {
  const { pendingSignatures, isLoading, isError, error } = usePendingSignatures();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">E-Signatures</h1>
          <p className="mt-2 text-gray-600">
            Manage signature workflows and sign documents electronically
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Signatures
                {pendingSignatures.length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                    {pendingSignatures.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Error State */}
            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">
                  Failed to load signatures: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            )}

            {/* Pending Signatures */}
            {activeTab === 'pending' && !isLoading && (
              <div className="space-y-4">
                {pendingSignatures.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pending signatures</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You dont have any documents waiting for your signature.
                    </p>
                  </div>
                ) : (
                  pendingSignatures.map((workflow: SignatureWorkflow) => (
                    <SignatureWorkflowCard key={workflow.id} workflow={workflow} />
                  ))
                )}
              </div>
            )}

            {/* Completed Signatures */}
            {activeTab === 'completed' && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No completed signatures yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Workflow Button */}
        <div className="text-center">
          <a
            href="/documents/signatures/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Signature Workflow
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Signature workflow card component
 */
interface SignatureWorkflowCardProps {
  workflow: SignatureWorkflow;
}

function SignatureWorkflowCard({ workflow }: SignatureWorkflowCardProps) {
  const pendingParties = workflow.parties.filter((p) => p.status === 'pending');

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{workflow.title}</h3>
          {workflow.description && (
            <p className="mt-1 text-sm text-gray-500">{workflow.description}</p>
          )}

          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="text-gray-500">
              Document: <span className="text-gray-900">{workflow.documentName}</span>
            </span>

            <span className="text-gray-500">
              Status:{' '}
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  workflow.status === 'in_progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : workflow.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {workflow.status.replace('_', ' ').toUpperCase()}
              </span>
            </span>
          </div>

          <div className="mt-3">
            <p className="text-sm text-gray-500 mb-2">
              Waiting for {pendingParties.length} signature(s):
            </p>
            <div className="flex flex-wrap gap-2">
              {pendingParties.map((party) => (
                <span
                  key={party.id}
                  className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                >
                  {party.name} ({party.role})
                </span>
              ))}
            </div>
          </div>

          {workflow.expiresAt && (
            <p className="mt-2 text-xs text-gray-500">
              Expires: {new Date(workflow.expiresAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <a
          href={`/documents/signatures/${workflow.id}`}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm whitespace-nowrap"
        >
          View & Sign
        </a>
      </div>
    </div>
  );
}
