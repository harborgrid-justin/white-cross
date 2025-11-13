export enum AlertType {
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  EXPIRED = 'EXPIRED',
  NEAR_EXPIRY = 'NEAR_EXPIRY',
  MAINTENANCE_DUE = 'MAINTENANCE_DUE',
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class InventoryAlertDto {
  id!: string;
  type!: AlertType;
  severity!: AlertSeverity;
  message!: string;
  itemId!: string;
  itemName!: string;
  daysUntilAction?: number;
}

export class AlertSummaryDto {
  timestamp!: Date;
  totalAlerts!: number;
  criticalCount!: number;
  highCount!: number;
  mediumCount!: number;
  lowCount!: number;
  typeBreakdown!: {
    LOW_STOCK: number;
    OUT_OF_STOCK: number;
    EXPIRED: number;
    NEAR_EXPIRY: number;
    MAINTENANCE_DUE: number;
  };
  topAlerts!: InventoryAlertDto[];
  recommendations!: string[];
}
