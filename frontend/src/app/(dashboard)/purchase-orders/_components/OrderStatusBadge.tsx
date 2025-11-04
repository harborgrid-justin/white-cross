/**
 * OrderStatusBadge Component
 *
 * Displays a status badge with icon and text for purchase order status
 */

'use client';

import { CheckCircle, XCircle, Package, FileText, Clock } from 'lucide-react';
import type { PurchaseOrderStatus } from '@/types/domain/purchaseOrders';
import { getStatusBadgeClasses, formatStatus } from './order-utils';

export interface OrderStatusBadgeProps {
  status: PurchaseOrderStatus;
  showIcon?: boolean;
  className?: string;
}

/**
 * Get appropriate icon for order status
 */
const getStatusIcon = (status: PurchaseOrderStatus) => {
  const iconClass = 'w-4 h-4';

  switch (status) {
    case 'PENDING':
      return <Clock className={iconClass} />;
    case 'APPROVED':
      return <CheckCircle className={iconClass} />;
    case 'ORDERED':
      return <FileText className={iconClass} />;
    case 'PARTIALLY_RECEIVED':
      return <Package className={iconClass} />;
    case 'RECEIVED':
      return <CheckCircle className={iconClass} />;
    case 'CANCELLED':
      return <XCircle className={iconClass} />;
    default:
      return <FileText className={iconClass} />;
  }
};

/**
 * Status badge component with icon and formatted text
 */
export function OrderStatusBadge({
  status,
  showIcon = true,
  className = '',
}: OrderStatusBadgeProps) {
  return (
    <span
      className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(
        status
      )} ${className}`}
    >
      {showIcon && getStatusIcon(status)}
      <span className={showIcon ? 'ml-1' : ''}>{formatStatus(status)}</span>
    </span>
  );
}
