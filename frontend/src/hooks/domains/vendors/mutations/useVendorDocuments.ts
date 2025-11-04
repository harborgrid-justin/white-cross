import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vendorKeys } from '../config';
import type { VendorDocument } from '../config';

export const useUploadVendorDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, documentData, file }: {
      vendorId: string;
      documentData: {
        type: 'W9' | 'INSURANCE_CERT' | 'LICENSE' | 'CERTIFICATION' | 'CONTRACT' | 'OTHER';
        title: string;
        expirationDate?: string;
        isRequired: boolean;
      };
      file: File;
    }): Promise<VendorDocument> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentData', JSON.stringify(documentData));

      const response = await fetch(`/api/vendors/${vendorId}/documents`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload document');
      return response.json();
    },
    onSuccess: (uploadedDocument, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.documents(vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
      toast.success(`Document "${uploadedDocument.title}" uploaded successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload document: ${error.message}`);
    },
  });
};

export const useDeleteVendorDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, documentId }: {
      vendorId: string;
      documentId: string;
    }): Promise<void> => {
      const response = await fetch(`/api/vendors/${vendorId}/documents/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete document');
    },
    onSuccess: (_, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.documents(vendorId) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
      toast.success('Document deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
  });
};

export const useReviewVendorDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, documentId, reviewData }: {
      vendorId: string;
      documentId: string;
      reviewData: {
        status: 'CURRENT' | 'EXPIRED' | 'EXPIRING_SOON';
        notes?: string;
      };
    }): Promise<VendorDocument> => {
      const response = await fetch(`/api/vendors/${vendorId}/documents/${documentId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) throw new Error('Failed to review document');
      return response.json();
    },
    onSuccess: (reviewedDocument, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.documents(vendorId) });
      toast.success('Document reviewed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to review document: ${error.message}`);
    },
  });
};
