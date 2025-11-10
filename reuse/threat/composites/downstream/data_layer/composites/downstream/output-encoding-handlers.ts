/**
 * LOC: OUTENC001
 * Purpose: Output encoding and escaping for security
 */
import { Injectable } from "@nestjs/common";
import { TransformationOperationsService, DataEncoding } from "../transformation-operations-kit";

@Injectable()
export class OutputEncodingService {
  constructor(private readonly transformService: TransformationOperationsService) {}
  
  encodeHTML(data: string): string {
    return this.transformService.encodeHTML(data);
  }
  
  encodeURL(data: string): string {
    return this.transformService.encodeURL(data);
  }
  
  encodeJSON(data: any): string {
    return JSON.stringify(data).replace(/[<>]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
  }
}

export { OutputEncodingService };
