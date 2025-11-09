
export enum MaterialCategory {
  CONCRETE = 'concrete',
  STEEL = 'steel',
  LUMBER = 'lumber',
  MASONRY = 'masonry',
  DRYWALL = 'drywall',
  INSULATION = 'insulation',
  ROOFING = 'roofing',
  ELECTRICAL = 'electrical',
  PLUMBING = 'plumbing',
  HVAC = 'hvac',
  PAINT = 'paint',
  FLOORING = 'flooring',
  HARDWARE = 'hardware',
  AGGREGATES = 'aggregates',
  ASPHALT = 'asphalt',
  GLASS = 'glass',
  SEALANTS = 'sealants',
  HAZARDOUS = 'hazardous',
}

export enum UnitOfMeasure {
  EACH = 'each',
  BOX = 'box',
  CASE = 'case',
  LINEAR_FOOT = 'linear_foot',
  SQUARE_FOOT = 'square_foot',
  CUBIC_YARD = 'cubic_yard',
  TON = 'ton',
  POUND = 'pound',
  GALLON = 'gallon',
  LITER = 'liter',
  PALLET = 'pallet',
  BUNDLE = 'bundle',
  ROLL = 'roll',
}

export enum MaterialStatus {
  AVAILABLE = 'available',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  ON_ORDER = 'on_order',
  DISCONTINUED = 'discontinued',
  QUARANTINED = 'quarantined',
}

export enum RequisitionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ORDERED = 'ordered',
  PARTIALLY_RECEIVED = 'partially_received',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
}

export enum WasteReason {
  SPILLAGE = 'spillage',
  DAMAGE = 'damage',
  DEFECTIVE = 'defective',
  OVERAGE = 'overage',
  EXPIRED = 'expired',
  CONTAMINATION = 'contamination',
  MISCALCULATION = 'miscalculation',
  REWORK = 'rework',
}

export enum InspectionStatus {
  PENDING = 'pending',
  PASSED = 'passed',
  FAILED = 'failed',
  CONDITIONAL = 'conditional',
  NOT_REQUIRED = 'not_required',
}
