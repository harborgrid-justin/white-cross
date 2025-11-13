import { Injectable } from '@nestjs/common';
import { RequestContextService } from '@/common/context/request-context.service';
import { BaseService } from '@/common/base';

@Injectable()
export class SettingsService extends BaseService {
  constructor(protected readonly requestContext: RequestContextService) {
    super(requestContext);
  }
}
