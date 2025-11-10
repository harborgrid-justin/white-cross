/**
 * LOC: SEARCH001
 * Purpose: Full-text search and filtering
 */
import { Injectable } from "@nestjs/common";
import { SearchOperationsService } from "../search-operations-kit";

@Injectable()
export class SearchService {
  constructor(private readonly searchOpsService: SearchOperationsService) {}
  
  async search(model: string, query: string, fields: string[]): Promise<any> {
    return this.searchOpsService.searchFullText(model, query, fields);
  }
}

export { SearchService };
