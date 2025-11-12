import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnterpriseFeaturesService } from './enterprise-features.service';

@ApiTags('Enterprise Features')
@Controller('enterprise-features')
@ApiBearerAuth()
export class EnterpriseFeaturesController {
  constructor(
    private readonly enterpriseFeaturesService: EnterpriseFeaturesService,
  ) {}
}
