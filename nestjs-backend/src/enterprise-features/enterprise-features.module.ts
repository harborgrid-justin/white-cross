import { Module } from '@nestjs/common';
import { EnterpriseFeaturesController } from './enterprise-features.controller';
import { EnterpriseFeaturesService } from './enterprise-features.service';

@Module({
  controllers: [EnterpriseFeaturesController],
  providers: [EnterpriseFeaturesService]
})
export class EnterpriseFeaturesModule {}
