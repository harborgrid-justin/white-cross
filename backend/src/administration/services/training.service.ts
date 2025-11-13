import { Injectable } from '@nestjs/common';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from "../../common/base";

@Injectable()
export class TrainingService extends BaseService {
  constructor(protected readonly requestContext: RequestContextService) {
    super(requestContext);
  }
}
