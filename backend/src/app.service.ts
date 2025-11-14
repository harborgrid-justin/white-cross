import { Injectable } from '@nestjs/common';

import { BaseService } from '@/common/base';
@Injectable()
export class AppService extends BaseService {
  constructor() {
    super("AppService");
  }

  getHello(): string {
    return 'Hello World!';
  }
}
