import { Injectable } from '@nestjs/common';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from '../../shared/base/base.service';

@Injectable()
export class SystemHealthService extends BaseService {
  constructor(protected readonly requestContext: RequestContextService) {
    super(requestContext);
  }
}
