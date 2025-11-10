/**
 * LOC: CACHE001
 * Purpose: Cache management and invalidation
 */
import { Injectable } from "@nestjs/common";
import { DataRetrievalService, CacheStrategy } from "../data-retrieval-kit";

@Injectable()
export class CacheManagerService {
  constructor(private readonly retrievalService: DataRetrievalService) {}
  
  async getCached(model: string, filters: any, strategy: CacheStrategy = "SHORT_TERM" as any): Promise<any> {
    return this.retrievalService.retrieveWithCache(model, filters, strategy);
  }
}

export { CacheManagerService };
