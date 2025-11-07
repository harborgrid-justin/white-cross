import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBackupDto, BackupQueryDto } from '../dto';
import { BackupType, BackupStatus } from '../enums/administration.enums';

export interface BackupLog {
  id: string;
  type: BackupType;
  status: BackupStatus;
  triggeredBy?: string;
  startedAt: Date;
  completedAt?: Date;
  fileSize?: number;
  errorMessage?: string;
}

@Injectable()
export class BackupService {
  private backups: BackupLog[] = [];

  public async createBackup(dto: CreateBackupDto): Promise<BackupLog> {
    const backup: BackupLog = {
      id: Math.random().toString(36).substr(2, 9),
      type: dto.type,
      status: BackupStatus.IN_PROGRESS,
      triggeredBy: dto.triggeredBy,
      startedAt: new Date(),
    };

    this.backups.push(backup);

    // Simulate backup completion
    setTimeout(() => {
      backup.status = BackupStatus.COMPLETED;
      backup.completedAt = new Date();
      backup.fileSize = Math.floor(Math.random() * 1000000);
    }, 1000);

    return backup;
  }

  async getBackupLogs(query: BackupQueryDto): Promise<{
    data: BackupLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 20 } = query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = this.backups.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total: this.backups.length,
      page,
      limit,
    };
  }

  async getBackupById(id: string): Promise<BackupLog> {
    const backup = this.backups.find((b) => b.id === id);
    if (!backup) {
      throw new NotFoundException(`Backup with ID ${id} not found`);
    }
    return backup;
  }
}
