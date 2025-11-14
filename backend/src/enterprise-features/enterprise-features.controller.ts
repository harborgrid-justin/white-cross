import { Controller, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnterpriseFeaturesService } from './enterprise-features.service';

import { BaseController } from '@/common/base';
@ApiTags('Enterprise Features')

@Version('1')
@Controller('enterprise-features')
@ApiBearerAuth()
export class EnterpriseFeaturesController extends BaseController {
  constructor(
    private readonly enterpriseFeaturesService: EnterpriseFeaturesService,
  ) {}
}
