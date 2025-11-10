/**
 * LOC: EXPORT001
 * Purpose: Data export endpoint implementations
 */
import { Injectable } from "@nestjs/common";
import { DataExportService } from "../data-export-kit";

@Injectable()
export class DataExportEndpointService {
  constructor(private readonly exportService: DataExportService) {}
  
  async exportToCSV(model: string, filters: any): Promise<Buffer> {
    return this.exportService.exportToCSV(model, filters);
  }
  
  async exportToExcel(model: string, filters: any): Promise<Buffer> {
    return this.exportService.exportToExcel(model, filters);
  }
}

export { DataExportEndpointService };
