/**
 * Inventory Stock History Hook
 *
 * Provides hook for fetching stock transaction history for inventory items.
 * Tracks all stock movements including adjustments, receiving, issuing, transfers, etc.
 *
 * @module hooks/domains/inventory/useInventory.history
 */

import { useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '@/services';
import toast from 'react-hot-toast';

/**
 * Hook for fetching stock transaction history for a specific inventory item.
 *
 * Tracks all stock movements including:
 * - Stock adjustments (manual corrections)
 * - Receiving transactions (purchase orders)
 * - Issuing transactions (consumption/usage)
 * - Transfers between locations
 * - Returns and write-offs
 *
 * History is paginated for performance with large transaction volumes.
 *
 * @param {string | null} itemId - Inventory item ID, or null to skip fetching
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [limit=50] - Transactions per page
 * @returns Object containing history array, pagination info, loading state, and refresh method
 *
 * @example
 * ```tsx
 * const { history, pagination, loading } = useStockHistory(itemId, 1, 25);
 *
 * return (
 *   <div>
 *     <h2>Stock History</h2>
 *     <table>
 *       <thead>
 *         <tr>
 *           <th>Date</th>
 *           <th>Type</th>
 *           <th>Quantity</th>
 *           <th>Balance</th>
 *           <th>User</th>
 *         </tr>
 *       </thead>
 *       <tbody>
 *         {history.map(transaction => (
 *           <tr key={transaction.id}>
 *             <td>{formatDate(transaction.date)}</td>
 *             <td>{transaction.type}</td>
 *             <td className={transaction.quantity > 0 ? 'positive' : 'negative'}>
 *               {transaction.quantity > 0 ? '+' : ''}{transaction.quantity}
 *             </td>
 *             <td>{transaction.balance}</td>
 *             <td>{transaction.user}</td>
 *           </tr>
 *         ))}
 *       </tbody>
 *     </table>
 *     <Pagination {...pagination} />
 *   </div>
 * );
 * ```
 */
export function useStockHistory(itemId: string | null, page: number = 1, limit: number = 50) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  const fetchHistory = useCallback(async () => {
    if (!itemId) {
      setHistory([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await inventoryApi.getStockHistory(itemId, page, limit);

      if (response.success) {
        setHistory(response.data?.history || []);
        setPagination(response.data?.pagination || {
          page: 1,
          limit: 50,
          total: 0,
          pages: 0
        });
      } else {
        throw new Error(response.error?.message || 'Failed to fetch stock history');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error(error.message || 'Failed to load stock history');
    } finally {
      setLoading(false);
    }
  }, [itemId, page, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    pagination,
    refresh: fetchHistory
  };
}
