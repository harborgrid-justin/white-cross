
export enum EquipmentCategory {
  EXCAVATOR = 'excavator',
  BULLDOZER = 'bulldozer',
  LOADER = 'loader',
  BACKHOE = 'backhoe',
  GRADER = 'grader',
  CRANE = 'crane',
  FORKLIFT = 'forklift',
  DUMP_TRUCK = 'dump_truck',
  CONCRETE_MIXER = 'concrete_mixer',
  CONCRETE_PUMP = 'concrete_pump',
  COMPACTOR = 'compactor',
  PAVER = 'paver',
  GENERATOR = 'generator',
  AIR_COMPRESSOR = 'air_compressor',
  SCAFFOLDING = 'scaffolding',
  LIFT = 'lift',
  DRILL = 'drill',
  SAW = 'saw',
  HAND_TOOLS = 'hand_tools',
  SAFETY_EQUIPMENT = 'safety_equipment',
}

export enum EquipmentStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  OUT_OF_SERVICE = 'out_of_service',
  RESERVED = 'reserved',
  IN_TRANSIT = 'in_transit',
  RETIRED = 'retired',
}

export enum OwnershipType {
  OWNED = 'owned',
  LEASED = 'leased',
  RENTED = 'rented',
  FINANCED = 'financed',
}

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  PREDICTIVE = 'predictive',
  EMERGENCY = 'emergency',
  INSPECTION = 'inspection',
}

export enum ConditionRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  CRITICAL = 'critical',
}

export enum CertificationStatus {
  VALID = 'valid',
  EXPIRING_SOON = 'expiring_soon',
  EXPIRED = 'expired',
  NOT_REQUIRED = 'not_required',
}
