import { WitnessRole, CaptureMethod } from './enums';

export interface WitnessStatement {
  id: string;
  incidentId: string;
  witnessName: string;
  witnessRole: WitnessRole;
  statement: string;
  captureMethod: CaptureMethod;
  timestamp: Date;
  signature?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}