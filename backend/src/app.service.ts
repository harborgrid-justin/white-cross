import { Injectable } from '@nestjs/common';

import { BaseService } from '../../common/base';
@Injectable()
export class AppService extends BaseService {
  getHello(): string {
    return 'Hello World!';
  }
}
