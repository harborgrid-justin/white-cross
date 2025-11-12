import { EvidenceSecurityLevel } from './enums';

export interface EvidenceFile {
  id: string;
  incidentId: string;
  type: 'photo' | 'video';
  filename: string;
  url: string;
  metadata: {
    fileSize: number;
    mimeType: string;
    resolution?: string;
    duration?: number; // for videos
  };
  uploadedBy: string;
  uploadedAt: Date;
  securityLevel: EvidenceSecurityLevel;
  checksum?: string;
}