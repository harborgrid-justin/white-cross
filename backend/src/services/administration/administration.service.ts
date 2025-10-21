import * as auditOperations from './auditOperations';
import * as backupOperations from './backupOperations';
import * as configurationOperations from './configurationOperations';
import * as districtOperations from './districtOperations';
import * as licenseOperations from './licenseOperations';
import * as performanceOperations from './performanceOperations';
import * as schoolOperations from './schoolOperations';
import * as settingsOperations from './settingsOperations';
import * as systemHealthOperations from './systemHealthOperations';
import * as trainingOperations from './trainingOperations';
import * as userManagementOperations from './userManagementOperations';

export const administrationService = {
  ...auditOperations,
  ...backupOperations,
  ...configurationOperations,
  ...districtOperations,
  ...licenseOperations,
  ...performanceOperations,
  ...schoolOperations,
  ...settingsOperations,
  ...systemHealthOperations,
  ...trainingOperations,
  ...userManagementOperations,
};
