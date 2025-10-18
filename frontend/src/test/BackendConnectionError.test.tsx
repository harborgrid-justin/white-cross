import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BackendConnectionError from '../components/BackendConnectionError';

describe('BackendConnectionError', () => {
  it('renders error message', () => {
    render(<BackendConnectionError />);
    
    expect(screen.getByText('Cannot Connect to Backend')).toBeInTheDocument();
    expect(screen.getByText(/The application server is not responding/)).toBeInTheDocument();
  });

  it('displays troubleshooting steps', () => {
    render(<BackendConnectionError />);
    
    expect(screen.getByText(/Check if the backend is running/)).toBeInTheDocument();
    expect(screen.getByText(/Verify database connection/)).toBeInTheDocument();
    expect(screen.getByText(/Check if database is running/)).toBeInTheDocument();
  });

  it('shows retry button', () => {
    render(<BackendConnectionError />);
    
    const retryButton = screen.getByText(/Retry Connection/);
    expect(retryButton).toBeInTheDocument();
  });

  it('shows reload button', () => {
    render(<BackendConnectionError />);
    
    const reloadButton = screen.getByText(/Reload Page/);
    expect(reloadButton).toBeInTheDocument();
  });

  it('displays success indicators', () => {
    render(<BackendConnectionError />);
    
    expect(screen.getByText(/Success Indicators/)).toBeInTheDocument();
    expect(screen.getByText(/White Cross API Server running/)).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const mockRetry = vi.fn();
    render(<BackendConnectionError onRetry={mockRetry} />);
    
    const retryButton = screen.getByText(/Retry Connection/);
    retryButton.click();
    
    expect(mockRetry).toHaveBeenCalled();
  });
});
