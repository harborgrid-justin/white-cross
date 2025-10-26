import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStudents } from '../queries/useStudents';
import { mockStudent, createMockArray } from '../../../../../tests/fixtures/mockData';
import { server } from '../../../../../tests/mocks/server';
import { http, HttpResponse } from 'msw';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useStudents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch students successfully', async () => {
    const mockStudents = createMockArray(mockStudent, 3);

    server.use(
      http.get('http://localhost:3001/api/v1/students', () => {
        return HttpResponse.json({
          success: true,
          data: {
            students: mockStudents,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        });
      })
    );

    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.students).toHaveLength(3);
    expect(result.current.data?.students[0]).toMatchObject({
      id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
    });
  });

  it('should handle pagination correctly', async () => {
    const mockStudents = createMockArray(mockStudent, 25);

    server.use(
      http.get('http://localhost:3001/api/v1/students', ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedStudents = mockStudents.slice(start, end);

        return HttpResponse.json({
          success: true,
          data: {
            students: paginatedStudents,
            pagination: {
              page,
              limit,
              total: mockStudents.length,
              totalPages: Math.ceil(mockStudents.length / limit),
            },
          },
        });
      })
    );

    const { result } = renderHook(
      () => useStudents({ page: 2, limit: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.students).toHaveLength(10);
    expect(result.current.data?.pagination.page).toBe(2);
    expect(result.current.data?.pagination.total).toBe(25);
  });

  it('should handle filtering by grade', async () => {
    const grade8Students = createMockArray(() => mockStudent({ grade: '8' }), 5);

    server.use(
      http.get('http://localhost:3001/api/v1/students', ({ request }) => {
        const url = new URL(request.url);
        const grade = url.searchParams.get('grade');

        return HttpResponse.json({
          success: true,
          data: {
            students: grade === '8' ? grade8Students : [],
            pagination: { page: 1, limit: 10, total: grade8Students.length, totalPages: 1 },
          },
        });
      })
    );

    const { result } = renderHook(
      () => useStudents({ grade: '8' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.students).toHaveLength(5);
    expect(result.current.data?.students.every((s: any) => s.grade === '8')).toBe(true);
  });

  it('should handle search query', async () => {
    const johnStudents = createMockArray(() => mockStudent({ firstName: 'John' }), 3);

    server.use(
      http.get('http://localhost:3001/api/v1/students', ({ request }) => {
        const url = new URL(request.url);
        const search = url.searchParams.get('search');

        return HttpResponse.json({
          success: true,
          data: {
            students: search?.toLowerCase().includes('john') ? johnStudents : [],
            pagination: { page: 1, limit: 10, total: johnStudents.length, totalPages: 1 },
          },
        });
      })
    );

    const { result } = renderHook(
      () => useStudents({ search: 'John' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.students).toHaveLength(3);
    expect(result.current.data?.students.every((s: any) => s.firstName === 'John')).toBe(true);
  });

  it('should handle API errors gracefully', async () => {
    server.use(
      http.get('http://localhost:3001/api/v1/students', () => {
        return HttpResponse.json(
          { success: false, error: 'Server error' },
          { status: 500 }
        );
      })
    );

    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should handle network errors', async () => {
    server.use(
      http.get('http://localhost:3001/api/v1/students', () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should cache results properly', async () => {
    const mockStudents = createMockArray(mockStudent, 3);
    let callCount = 0;

    server.use(
      http.get('http://localhost:3001/api/v1/students', () => {
        callCount++;
        return HttpResponse.json({
          success: true,
          data: {
            students: mockStudents,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        });
      })
    );

    const wrapper = createWrapper();

    // First call
    const { result: result1 } = renderHook(() => useStudents(), { wrapper });
    await waitFor(() => expect(result1.current.isSuccess).toBe(true));

    // Second call should use cache
    const { result: result2 } = renderHook(() => useStudents(), { wrapper });
    await waitFor(() => expect(result2.current.isSuccess).toBe(true));

    // Should only call API once due to caching
    expect(callCount).toBe(1);
  });

  it('should handle empty results', async () => {
    server.use(
      http.get('http://localhost:3001/api/v1/students', () => {
        return HttpResponse.json({
          success: true,
          data: {
            students: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
          },
        });
      })
    );

    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.students).toHaveLength(0);
    expect(result.current.data?.pagination.total).toBe(0);
  });

  it('should support refetching', async () => {
    const mockStudents = createMockArray(mockStudent, 3);
    let callCount = 0;

    server.use(
      http.get('http://localhost:3001/api/v1/students', () => {
        callCount++;
        return HttpResponse.json({
          success: true,
          data: {
            students: mockStudents,
            pagination: { page: 1, limit: 10, total: 3, totalPages: 1 },
          },
        });
      })
    );

    const { result } = renderHook(() => useStudents(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(callCount).toBe(1);

    // Manually refetch
    await result.current.refetch();

    expect(callCount).toBe(2);
  });
});
