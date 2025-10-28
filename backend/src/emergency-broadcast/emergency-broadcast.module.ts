import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmergencyBroadcastController } from './emergency-broadcast.controller';
import { EmergencyBroadcastService } from './emergency-broadcast.service';
import { EmergencyBroadcastRepository } from '../database/repositories/impl/emergency-broadcast.repository';
import { StudentRepository } from '../database/repositories/impl/student.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [EmergencyBroadcastController],
  providers: [
    EmergencyBroadcastService,
    EmergencyBroadcastRepository,
    StudentRepository
  ]
})
export class EmergencyBroadcastModule {}
