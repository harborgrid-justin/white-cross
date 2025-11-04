/**
 * Consent Form Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConsentForm } from '../../models/consent-form.model';

@Injectable()
export class ConsentFormRepository {
  constructor(
    @InjectModel(ConsentForm)
    private readonly consentFormModel: typeof ConsentForm,
  ) {}

  async findAll(): Promise<ConsentForm[]> {
    return this.consentFormModel.findAll();
  }

  async findById(id: string): Promise<ConsentForm | null> {
    return this.consentFormModel.findByPk(id);
  }

  async create(data: Partial<ConsentForm>): Promise<ConsentForm> {
    return this.consentFormModel.create(data as any);
  }

  async update(id: string, data: Partial<ConsentForm>): Promise<[number]> {
    return this.consentFormModel.update(data as any, {
      where: { id },
    });
  }

  async delete(id: string): Promise<number> {
    return this.consentFormModel.destroy({
      where: { id },
    });
  }
}
