/**
 * Document detail page
 *
 * @module app/documents/[id]/page
 * @description View and manage a single document
 */

'use client';

import React from 'react';
import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { formatFileSize, getFileIcon, downloadDocument } from '@/services/documents';
import type { Document } from '@/types/documents';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function fetchDocument(id: string): Promise<Document> {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch document');
  }

  return response.json();
}

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const {
    data: document,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['document', id],
    queryFn: () => fetchDocument(id)
  });

  const handleDownload = async () => {
    if (!document) return;

    try {
      await downloadDocument(document);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download document');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      router.push('/documents');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete document');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError || !document) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Failed to load document: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const icon = getFileIcon(document.file.mimeType);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/documents')}
            className="text-sm text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Documents
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="text-4xl mr-4">{icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{document.metadata.title}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {formatFileSize(document.file.size)} • Uploaded{' '}
                  {new Date(document.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Document Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Document Information</h2>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {document.metadata.category.replace('_', ' ')}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Access Level</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {document.metadata.accessLevel.toUpperCase()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{document.status.replace('_', ' ')}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Version</dt>
              <dd className="mt-1 text-sm text-gray-900">v{document.version}</dd>
            </div>

            {document.metadata.description && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{document.metadata.description}</dd>
              </div>
            )}

            {document.metadata.tags.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Tags</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {document.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* File Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">File Details</h2>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">File Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{document.file.originalName}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">File Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{document.file.mimeType}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">File Size</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatFileSize(document.file.size)}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Checksum</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono truncate">
                {document.file.checksum}
              </dd>
            </div>

            {document.file.pageCount && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Pages</dt>
                <dd className="mt-1 text-sm text-gray-900">{document.file.pageCount}</dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500">Virus Scan</dt>
              <dd className="mt-1">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    document.file.virusScanStatus === 'clean'
                      ? 'bg-green-100 text-green-800'
                      : document.file.virusScanStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {document.file.virusScanStatus.toUpperCase()}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Activity</h2>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-32">Created by:</span>
              <span className="text-gray-900">{document.createdByName}</span>
            </div>

            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-32">Created on:</span>
              <span className="text-gray-900">
                {new Date(document.createdAt).toLocaleString()}
              </span>
            </div>

            {document.modifiedAt && (
              <>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Modified by:</span>
                  <span className="text-gray-900">{document.modifiedByName}</span>
                </div>

                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-32">Modified on:</span>
                  <span className="text-gray-900">
                    {new Date(document.modifiedAt).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
