/**
 * Mobile sync enums
 */

export enum SyncActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ'
}

export enum SyncEntityType {
  STUDENT = 'STUDENT',
  HEALTH_RECORD = 'HEALTH_RECORD',
  MEDICATION = 'MEDICATION',
  INCIDENT = 'INCIDENT',
  VACCINATION = 'VACCINATION',
  APPOINTMENT = 'APPOINTMENT',
  SCREENING = 'SCREENING',
  ALLERGY = 'ALLERGY',
  CHRONIC_CONDITION = 'CHRONIC_CONDITION'
}

export enum SyncPriority {
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW'
}

export enum ConflictResolution {
  CLIENT_WINS = 'CLIENT_WINS',
  SERVER_WINS = 'SERVER_WINS',
  NEWEST_WINS = 'NEWEST_WINS',
  MERGE = 'MERGE',
  MANUAL = 'MANUAL'
}

export enum SyncStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  DEFERRED = 'DEFERRED'
}
