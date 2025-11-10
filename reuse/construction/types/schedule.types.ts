
export enum DurationType {
  WORKING_DAYS = 'working_days',
  CALENDAR_DAYS = 'calendar_days',
  HOURS = 'hours',
}

export enum ActivityStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SUSPENDED = 'suspended',
}

export enum ConstraintType {
  START_NO_EARLIER = 'start_no_earlier',
  FINISH_NO_LATER = 'finish_no_later',
  MUST_START_ON = 'must_start_on',
  MUST_FINISH_ON = 'must_finish_on',
}

export enum RelationshipType {
  FS = 'FS',
  SS = 'SS',
  FF = 'FF',
  SF = 'SF',
}

export enum ResourceType {
  LABOR = 'labor',
  EQUIPMENT = 'equipment',
  MATERIAL = 'material',
}

export enum MilestoneStatus {
  UPCOMING = 'upcoming',
  ACHIEVED = 'achieved',
  MISSED = 'missed',
  AT_RISK = 'at_risk',
}

export enum DelayType {
  EXCUSABLE = 'excusable',
  COMPENSABLE = 'compensable',
  CONCURRENT = 'concurrent',
  NON_EXCUSABLE = 'non_excusable',
}
