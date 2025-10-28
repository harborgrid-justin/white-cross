import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiSearchService } from './ai-search.service';
import { AiSearchController } from './ai-search.controller';

@Module({
  imports: [ConfigModule],
  controllers: [AiSearchController],
  providers: [AiSearchService],
  exports: [AiSearchService],
})
export class AiSearchModule {}
