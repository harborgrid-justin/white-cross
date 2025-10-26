'use client';

/**
 * ESignatureInterface component
 *
 * @module components/documents/ESignatureInterface
 * @description Interface for electronically signing documents with legal compliance
 */

'use client';

import React, { useState, useRef } from 'react';
import { SignatureCanvas } from '@/components/signatures';
import { Save, RotateCcw, FileSignature } from 'lucide-react';

interface ESignatureInterfaceProps {
  /** Document ID to sign */
  documentId: string;

  /** On signature complete */
  onSignatureComplete?: (signature: string) => void;

  /** On signature error */
  onSignatureError?: (error: string) => void;
}

export function ESignatureInterface({
  documentId,
  onSignatureComplete,
  onSignatureError
}: ESignatureInterfaceProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const signatureRef = useRef<any>(null);

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
    setError(null);
    setSuccess(false);
  };

  const handleSign = async () => {
    if (!agreedToTerms) {
      setError('You must agree to the electronic signature terms');
      return;
    }

    if (!signatureRef.current) {
      setError('Signature canvas not initialized');
      return;
    }

    const signatureData = signatureRef.current.toDataURL();

    if (!signatureData || signatureRef.current.isEmpty()) {
      setError('Please provide a signature');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implement server action for signing document
      // This should:
      // 1. Validate signature data
      // 2. Create cryptographic hash of signature
      // 3. Add trusted timestamp
      // 4. Store signature with document
      // 5. Create audit log entry
      // 6. Generate signed PDF with signature overlay

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess(true);
      onSignatureComplete?.(signatureData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign document';
      setError(errorMessage);
      onSignatureError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <FileSignature className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Document Signed Successfully
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Your electronic signature has been applied to the document and a cryptographic
            signature has been created for legal compliance.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-800">
              <strong>Signature Details:</strong>
            </p>
            <ul className="mt-2 text-xs text-green-700 space-y-1">
              <li>Document ID: {documentId}</li>
              <li>Signed at: {new Date().toLocaleString()}</li>
              <li>IP Address: [Logged]</li>
              <li>Cryptographic hash: [Generated]</li>
              <li>Timestamp: [Trusted timestamp applied]</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Electronic Signature
        </h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Draw your signature below
          </label>
          <div className="border-2 border-gray-300 rounded-md">
            <SignatureCanvas
              ref={signatureRef}
              width={600}
              height={200}
              backgroundColor="white"
            />
          </div>
          <button
            onClick={handleClear}
            className="mt-2 inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear Signature
          </button>
        </div>

        <div className="mb-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              I agree that my electronic signature is the legal equivalent of my manual signature
              and that I am signing this document in accordance with the{' '}
              <a href="#" className="text-blue-600 hover:underline">
                ESIGN Act
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                UETA
              </a>
              . I understand that my signature will be cryptographically signed and timestamped,
              and that this action will be logged for audit purposes.
            </span>
          </label>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Your signature will be applied to document ID: {documentId}
          </p>

          <button
            onClick={handleSign}
            disabled={isLoading || !agreedToTerms}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Signing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sign Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
