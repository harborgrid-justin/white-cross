/**
 * Consent Signature Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConsentSignature } from '../../models/consent-signature.model';

@Injectable()
export class ConsentSignatureRepository {
  constructor(
    @InjectModel(ConsentSignature)
    private readonly consentSignatureModel: typeof ConsentSignature,
  ) {}

  async findAll(): Promise<ConsentSignature[]> {
    return this.consentSignatureModel.findAll();
  }

  async findById(id: string): Promise<ConsentSignature | null> {
    return this.consentSignatureModel.findByPk(id);
  }

  async create(data: Partial<ConsentSignature>): Promise<ConsentSignature> {
    return this.consentSignatureModel.create(data as any);
  }

  async update(id: string, data: Partial<ConsentSignature>): Promise<[number]> {
    return this.consentSignatureModel.update(data as any, {
      where: { id },
    });
  }

  async delete(id: string): Promise<number> {
    return this.consentSignatureModel.destroy({
      where: { id },
    });
  }
}
