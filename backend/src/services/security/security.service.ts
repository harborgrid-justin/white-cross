import { Injectable } from '@nestjs/common';

import { BaseService } from '@/common/base';
@Injectable()
export class SecurityService extends BaseService {
  constructor() {
    super("SecurityService");
  }
}
