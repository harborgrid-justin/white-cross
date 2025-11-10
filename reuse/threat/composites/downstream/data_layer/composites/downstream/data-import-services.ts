/**
 * LOC: IMPORT001
 * Purpose: Data import from various sources
 */
import { Injectable } from "@nestjs/common";
import { ImportOperationsService } from "../import-operations-kit";

@Injectable()
export class DataImportService {
  constructor(private readonly importService: ImportOperationsService) {}
  
  async importCSV(model: string, csvData: string): Promise<any> {
    return this.importService.importCSV(model, csvData);
  }
  
  async importJSON(model: string, jsonData: any): Promise<any> {
    return this.importService.importJSON(model, jsonData);
  }
}

export { DataImportService };
