/**
 * InventoryCard Component
 * Purpose: Individual inventory item card
 * Features: Quantity, expiration, location, alerts
 */

import React from 'react';

interface InventoryCardProps {
  item?: any;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ item }) => {
  return (
    <div className="inventory-card">
      <h3>Inventory Item</h3>
      {item ? (
        <>
          <p>Medication: {item.medication}</p>
          <p>Quantity: {item.quantity}</p>
        </>
      ) : (
        <p>No inventory item provided.</p>
      )}
    </div>
  );
};

export default InventoryCard;
