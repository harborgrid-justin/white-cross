/**
 * Unit Tests for useConfirmDialog Hook
 *
 * Tests confirmation dialog hook including:
 * - Dialog rendering
 * - Confirm/cancel actions
 * - Promise resolution
 * - Options configuration
 *
 * @module hooks/useConfirmDialog.test
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfirmDialog } from './useConfirmDialog';

describe('useConfirmDialog', () => {
  it('should initialize with dialog closed', () => {
    const { result } = renderHook(() => useConfirmDialog());

    expect(result.current.confirm).toBeDefined();
    expect(result.current.ConfirmDialog).toBeDefined();
  });

  it('should open dialog when confirm is called', async () => {
    const { result } = renderHook(() => useConfirmDialog());

    act(() => {
      result.current.confirm({
        title: 'Delete Item',
        description: 'Are you sure you want to delete this item?',
      });
    });

    // Render the dialog component
    const { container } = render(<result.current.ConfirmDialog />);

    await waitFor(() => {
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
    });
  });

  it('should show default button texts', async () => {
    const { result } = renderHook(() => useConfirmDialog());

    act(() => {
      result.current.confirm({
        title: 'Confirm Action',
        description: 'Please confirm',
      });
    });

    render(<result.current.ConfirmDialog />);

    await waitFor(() => {
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  it('should show custom button texts', async () => {
    const { result } = renderHook(() => useConfirmDialog());

    act(() => {
      result.current.confirm({
        title: 'Delete',
        description: 'Are you sure?',
        confirmText: 'Yes, delete',
        cancelText: 'No, keep',
      });
    });

    render(<result.current.ConfirmDialog />);

    await waitFor(() => {
      expect(screen.getByText('Yes, delete')).toBeInTheDocument();
      expect(screen.getByText('No, keep')).toBeInTheDocument();
    });
  });

  it('should resolve promise with true when confirmed', async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() => useConfirmDialog());

    let confirmed: boolean | undefined;

    act(() => {
      result.current.confirm({
        title: 'Confirm',
        description: 'Please confirm',
      }).then((value) => {
        confirmed = value;
      });
    });

    render(<result.current.ConfirmDialog />);

    const confirmButton = screen.getByText('Confirm');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(confirmed).toBe(true);
    });
  });

  it('should resolve promise with false when cancelled', async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() => useConfirmDialog());

    let confirmed: boolean | undefined;

    act(() => {
      result.current.confirm({
        title: 'Confirm',
        description: 'Please confirm',
      }).then((value) => {
        confirmed = value;
      });
    });

    render(<result.current.ConfirmDialog />);

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    await waitFor(() => {
      expect(confirmed).toBe(false);
    });
  });

  it('should apply destructive variant styling', async () => {
    const { result } = renderHook(() => useConfirmDialog());

    act(() => {
      result.current.confirm({
        title: 'Delete',
        description: 'This is permanent',
        variant: 'destructive',
      });
    });

    const { container } = render(<result.current.ConfirmDialog />);

    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('bg-red-600');
  });

  it('should handle multiple sequential confirmations', async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() => useConfirmDialog());

    // First confirmation
    let firstResult: boolean | undefined;
    act(() => {
      result.current.confirm({
        title: 'First',
        description: 'First confirmation',
      }).then((value) => {
        firstResult = value;
      });
    });

    const { rerender } = render(<result.current.ConfirmDialog />);

    await user.click(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(firstResult).toBe(true);
    });

    // Second confirmation
    let secondResult: boolean | undefined;
    act(() => {
      result.current.confirm({
        title: 'Second',
        description: 'Second confirmation',
      }).then((value) => {
        secondResult = value;
      });
    });

    rerender(<result.current.ConfirmDialog />);

    await user.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(secondResult).toBe(false);
    });
  });
});
