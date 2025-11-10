/**
 * LOC: QUERY001
 * Purpose: Dynamic query building and execution
 */
import { Injectable } from "@nestjs/common";
import { FilterOperationsService } from "../filter-operations-kit";
import { QueryOptimizationService } from "../query-optimization-kit";

@Injectable()
export class QueryService {
  constructor(
    private readonly filterService: FilterOperationsService,
    private readonly optimizationService: QueryOptimizationService,
  ) {}
  
  async buildQuery(model: string, criteria: any): Promise<any> {
    const filters = this.filterService.buildComplexFilter(criteria);
    return this.optimizationService.optimizeQuery(model, { where: filters });
  }
}

export { QueryService };
