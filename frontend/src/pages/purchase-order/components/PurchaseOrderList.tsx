/**
 * Purchase Order List Component
 * 
 * Displays a list of purchase orders with sorting and filtering capabilities.
 */

import React from 'react';

interface PurchaseOrderListProps {
  /** Array of purchase orders to display */
  orders?: any[];
  /** Callback when an order is selected */
  onOrderSelect?: (orderId: string) => void;
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
}

/**
 * PurchaseOrderList component displays a list of purchase orders
 * with sorting, filtering, and selection capabilities.
 */
const PurchaseOrderList: React.FC<PurchaseOrderListProps> = ({
  orders = [],
  onOrderSelect,
  loading = false,
  error = null,
}) => {
  if (loading) {
    return <div>Loading purchase orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (orders.length === 0) {
    return <div>No purchase orders found.</div>;
  }

  return (
    <div className="purchase-order-list">
      <h2>Purchase Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id} onClick={() => onOrderSelect?.(order.id)}>
            {order.orderNumber} - {order.vendor}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PurchaseOrderList;
