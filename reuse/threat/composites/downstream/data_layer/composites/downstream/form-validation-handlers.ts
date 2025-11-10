/**
 * LOC: FORMVAL001
 * Purpose: Form validation for client and server sync
 */
import { Injectable } from "@nestjs/common";
import { ValidationOperationsService } from "../validation-operations-kit";

@Injectable()
export class FormValidationService {
  constructor(private readonly validationService: ValidationOperationsService) {}
  
  async validateForm(formData: Record<string, any>, rules: any[]): Promise<any> {
    const results = [];
    for (const field of Object.keys(formData)) {
      const result = this.validationService.validateRequired(formData[field], field);
      results.push(result);
    }
    return { valid: results.every(r => r.valid), errors: results.flatMap(r => r.errors) };
  }
}

export { FormValidationService };
