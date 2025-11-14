/**
 * Streaming Module
 *
 * Provides streaming query operations for large dataset processing
 */

import { Module } from '@nestjs/common';
import { StreamingQueryService } from './streaming-query.service';

@Module({
  providers: [StreamingQueryService],
  exports: [StreamingQueryService],
})
export class StreamingModule {}