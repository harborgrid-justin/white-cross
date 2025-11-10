/**
 * LOC: ROUASSET001
 * File: /reuse/edwards/financial/composites/downstream/rou-asset-management-services.ts
 * Purpose: Right-of-Use Asset Management Services
 */
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ROUAssetManagementService {
  private readonly logger = new Logger(ROUAssetManagementService.name);

  async createROUAsset(leaseId: number, value: number): Promise<any> {
    this.logger.log(`Creating ROU asset for lease ${leaseId}`);
    return { rouAssetId: 1, leaseId, value, bookValue: value };
  }

  async depreciateROUAsset(assetId: number, amount: number): Promise<any> {
    return { assetId, depreciationAmount: amount, newBookValue: 95000 };
  }
}
export { ROUAssetManagementService };
