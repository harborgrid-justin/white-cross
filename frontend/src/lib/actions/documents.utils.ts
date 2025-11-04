/**
 * @fileoverview Document Utility Functions
 * @module lib/actions/documents.utils
 *
 * Utility functions for document operations.
 * Helper functions for common document-related tasks.
 */

'use server';

// Import cached functions
import { getDocument, getDocuments } from './documents.cache';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if document exists
 *
 * @param documentId - The ID of the document to check
 * @returns Promise<boolean> - True if document exists, false otherwise
 */
export async function documentExists(documentId: string): Promise<boolean> {
  const document = await getDocument(documentId);
  return document !== null;
}

/**
 * Get document count
 *
 * @param filters - Optional filters to apply to the document query
 * @returns Promise<number> - Total number of documents matching the filters
 */
export async function getDocumentCount(filters?: Record<string, unknown>): Promise<number> {
  try {
    const documents = await getDocuments(filters);
    return documents.length;
  } catch {
    return 0;
  }
}
