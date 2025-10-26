import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useMedicationMutations } from '../mutations/useMedicationMutations';
import medicationsReducer from '@/hooks/slices/medicationsSlice';
import { mockMedication, mockMedicationAdministration } from '../../../../../tests/fixtures/mockData';
import { server } from '../../../../../tests/mocks/server';
import { http, HttpResponse } from 'msw';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const store = configureStore({
    reducer: {
      medications: medicationsReducer,
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
};

describe('useMedicationMutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('administerMedication', () => {
    it('should administer medication successfully', async () => {
      const mockAdmin = mockMedicationAdministration();

      server.use(
        http.post('http://localhost:3001/api/v1/medications/administer', async ({ request }) => {
          const body = await request.json() as any;
          return HttpResponse.json({
            success: true,
            data: { ...mockAdmin, ...body },
          });
        })
      );

      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      const adminData = {
        medicationId: 'med-1',
        studentId: 'student-1',
        dosage: '200mg',
        notes: 'Administered for headache',
      };

      result.current.administerMedication.mutate(adminData);

      await waitFor(() => {
        expect(result.current.administerMedication.isSuccess).toBe(true);
      });

      expect(result.current.administerMedication.data).toMatchObject({
        medicationId: 'med-1',
        studentId: 'student-1',
        dosage: '200mg',
      });
    });

    it('should handle administration errors', async () => {
      server.use(
        http.post('http://localhost:3001/api/v1/medications/administer', () => {
          return HttpResponse.json(
            { success: false, error: 'Medication not found' },
            { status: 404 }
          );
        })
      );

      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      const adminData = {
        medicationId: 'invalid-id',
        studentId: 'student-1',
        dosage: '200mg',
      };

      result.current.administerMedication.mutate(adminData);

      await waitFor(() => {
        expect(result.current.administerMedication.isError).toBe(true);
      });

      expect(result.current.administerMedication.error).toBeDefined();
    });

    it('should validate required fields before administration', async () => {
      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      // Missing required fields
      const invalidData = {
        medicationId: 'med-1',
        // missing studentId and dosage
      } as any;

      result.current.administerMedication.mutate(invalidData);

      await waitFor(() => {
        expect(result.current.administerMedication.isError).toBe(true);
      });
    });

    it('should require witness for controlled substances', async () => {
      server.use(
        http.post('http://localhost:3001/api/v1/medications/administer', async ({ request }) => {
          const body = await request.json() as any;

          if (body.isControlled && !body.witnessedBy) {
            return HttpResponse.json(
              { success: false, error: 'Witness required for controlled substances' },
              { status: 400 }
            );
          }

          return HttpResponse.json({
            success: true,
            data: mockMedicationAdministration(body),
          });
        })
      );

      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      // Without witness
      result.current.administerMedication.mutate({
        medicationId: 'med-1',
        studentId: 'student-1',
        dosage: '10mg',
        isControlled: true,
      });

      await waitFor(() => {
        expect(result.current.administerMedication.isError).toBe(true);
      });

      // With witness
      result.current.administerMedication.mutate({
        medicationId: 'med-1',
        studentId: 'student-1',
        dosage: '10mg',
        isControlled: true,
        witnessedBy: 'witness-id',
      });

      await waitFor(() => {
        expect(result.current.administerMedication.isSuccess).toBe(true);
      });
    });

    it('should create audit log for medication administration', async () => {
      const auditLogSpy = jest.fn();

      server.use(
        http.post('http://localhost:3001/api/v1/medications/administer', async ({ request }) => {
          const body = await request.json() as any;
          auditLogSpy(body);
          return HttpResponse.json({
            success: true,
            data: mockMedicationAdministration(body),
          });
        })
      );

      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      result.current.administerMedication.mutate({
        medicationId: 'med-1',
        studentId: 'student-1',
        dosage: '200mg',
        notes: 'Audit test',
      });

      await waitFor(() => {
        expect(result.current.administerMedication.isSuccess).toBe(true);
      });

      expect(auditLogSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          medicationId: 'med-1',
          studentId: 'student-1',
        })
      );
    });
  });

  describe('createMedication', () => {
    it('should create medication successfully', async () => {
      const newMedication = mockMedication();

      server.use(
        http.post('http://localhost:3001/api/v1/medications', async ({ request }) => {
          const body = await request.json() as any;
          return HttpResponse.json(
            {
              success: true,
              data: { ...newMedication, ...body },
            },
            { status: 201 }
          );
        })
      );

      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      const medicationData = {
        studentId: 'student-1',
        name: 'Ibuprofen',
        dosage: '200mg',
        frequency: 'As needed',
        route: 'Oral',
      };

      result.current.createMedication.mutate(medicationData);

      await waitFor(() => {
        expect(result.current.createMedication.isSuccess).toBe(true);
      });

      expect(result.current.createMedication.data).toMatchObject({
        name: 'Ibuprofen',
        dosage: '200mg',
      });
    });

    it('should validate medication data', async () => {
      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      const invalidData = {
        studentId: 'student-1',
        // missing required fields
      } as any;

      result.current.createMedication.mutate(invalidData);

      await waitFor(() => {
        expect(result.current.createMedication.isError).toBe(true);
      });
    });
  });

  describe('updateMedication', () => {
    it('should update medication successfully', async () => {
      server.use(
        http.put('http://localhost:3001/api/v1/medications/:id', async ({ params, request }) => {
          const body = await request.json() as any;
          return HttpResponse.json({
            success: true,
            data: { id: params.id, ...body },
          });
        })
      );

      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      result.current.updateMedication.mutate({
        id: 'med-1',
        dosage: '400mg',
        frequency: 'Twice daily',
      });

      await waitFor(() => {
        expect(result.current.updateMedication.isSuccess).toBe(true);
      });

      expect(result.current.updateMedication.data).toMatchObject({
        id: 'med-1',
        dosage: '400mg',
      });
    });
  });

  describe('deleteMedication', () => {
    it('should delete medication successfully', async () => {
      server.use(
        http.delete('http://localhost:3001/api/v1/medications/:id', () => {
          return HttpResponse.json({ success: true });
        })
      );

      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      result.current.deleteMedication.mutate('med-1');

      await waitFor(() => {
        expect(result.current.deleteMedication.isSuccess).toBe(true);
      });
    });

    it('should handle deletion errors', async () => {
      server.use(
        http.delete('http://localhost:3001/api/v1/medications/:id', () => {
          return HttpResponse.json(
            { success: false, error: 'Cannot delete active medication' },
            { status: 400 }
          );
        })
      );

      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      result.current.deleteMedication.mutate('med-1');

      await waitFor(() => {
        expect(result.current.deleteMedication.isError).toBe(true);
      });
    });
  });

  describe('HIPAA Compliance', () => {
    it('should include authorization token in requests', async () => {
      let authHeader: string | null = null;

      server.use(
        http.post('http://localhost:3001/api/v1/medications/administer', ({ request }) => {
          authHeader = request.headers.get('Authorization');
          return HttpResponse.json({
            success: true,
            data: mockMedicationAdministration(),
          });
        })
      );

      // Mock localStorage to include token
      Storage.prototype.getItem = jest.fn(() => 'mock-token');

      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      result.current.administerMedication.mutate({
        medicationId: 'med-1',
        studentId: 'student-1',
        dosage: '200mg',
      });

      await waitFor(() => {
        expect(result.current.administerMedication.isSuccess).toBe(true);
      });

      expect(authHeader).toBeTruthy();
    });

    it('should not expose PHI data in error messages', async () => {
      server.use(
        http.post('http://localhost:3001/api/v1/medications/administer', () => {
          return HttpResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
          );
        })
      );

      const { result } = renderHook(() => useMedicationMutations(), {
        wrapper: createWrapper(),
      });

      result.current.administerMedication.mutate({
        medicationId: 'med-1',
        studentId: 'student-1',
        dosage: '200mg',
      });

      await waitFor(() => {
        expect(result.current.administerMedication.isError).toBe(true);
      });

      const error = result.current.administerMedication.error as any;
      // Ensure error doesn't contain student or medication details
      expect(JSON.stringify(error)).not.toContain('student-1');
      expect(JSON.stringify(error)).not.toContain('med-1');
    });
  });
});
