/**
 * LOC: EDU-DOWN-ATTENDANCE-MOD-010
 * Attendance Management Module
 * Provides attendance management services and controllers
 */

import { Module } from '@nestjs/common';
import { AttendanceManagementController } from './attendance-management-controller';
import { AttendanceManagementService } from './attendance-management-service';

@Module({
  controllers: [AttendanceManagementController],
  providers: [AttendanceManagementService],
  exports: [AttendanceManagementService],
})
export class AttendanceManagementModule {}
