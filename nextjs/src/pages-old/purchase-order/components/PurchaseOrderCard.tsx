/**
 * Purchase Order Card Component
 * 
 * Displays a purchase order in card format with key information.
 */

import React from 'react';

interface PurchaseOrderCardProps {
  /** Purchase order data */
  order: any;
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Whether the card is selected */
  selected?: boolean;
}

/**
 * PurchaseOrderCard component displays a purchase order in a card layout.
 */
const PurchaseOrderCard: React.FC<PurchaseOrderCardProps> = ({
  order,
  onClick,
  selected = false,
}) => {
  return (
    <div 
      className={`purchase-order-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="card-header">
        <h3>{order.orderNumber}</h3>
        <span className="status">{order.status}</span>
      </div>
      <div className="card-body">
        <p><strong>Vendor:</strong> {order.vendor}</p>
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Date:</strong> {order.date}</p>
      </div>
    </div>
  );
};

export default PurchaseOrderCard;
