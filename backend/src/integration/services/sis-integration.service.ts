import { Injectable } from '@nestjs/common';

import { BaseService } from '@/common/base';
@Injectable()
export class SisIntegrationService extends BaseService {
  constructor() {
    super("SisIntegrationService");
  }
}
