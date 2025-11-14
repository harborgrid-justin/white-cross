import { Body, Controller, Get, Param, Post, Query, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { OfflineSyncService } from '../services/offline-sync.service';
import { QueueSyncActionDto, ResolveConflictDto, SyncOptionsDto } from '../dto';

import { BaseController } from '@/common/base';
/**
 * Sync Controller
 * Handles offline data synchronization
 */
@ApiTags('mobile-sync')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)

@Version('1')
@Controller('mobile/sync')
export class SyncController extends BaseController {
  constructor(private readonly offlineSyncService: OfflineSyncService) {}

  @Post('queue')
  @ApiOperation({ summary: 'Queue a sync action for offline processing' })
  @ApiResponse({ status: 201, description: 'Sync action queued successfully' })
  async queueAction(
    @CurrentUser('id') userId: string,
    @Body() dto: QueueSyncActionDto,
  ) {
    return this.offlineSyncService.queueAction(userId, dto);
  }

  @Post('process')
  @ApiOperation({ summary: 'Process pending sync actions' })
  @ApiResponse({ status: 200, description: 'Sync processing completed' })
  async processPending(
    @CurrentUser('id') userId: string,
    @Query('deviceId') deviceId: string,
    @Body() options?: SyncOptionsDto,
  ) {
    return this.offlineSyncService.syncPendingActions(
      userId,
      deviceId,
      options,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get sync statistics for a device' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics(
    @CurrentUser('id') userId: string,
    @Query('deviceId') deviceId: string,
  ) {
    return this.offlineSyncService.getStatistics(userId, deviceId);
  }

  @Get('conflicts')
  @ApiOperation({ summary: 'List pending conflicts' })
  @ApiResponse({ status: 200, description: 'Conflicts retrieved successfully' })
  async listConflicts(
    @CurrentUser('id') userId: string,
    @Query('deviceId') deviceId: string,
  ) {
    return this.offlineSyncService.listConflicts(userId, deviceId);
  }

  @Post('conflicts/:id/resolve')
  @ApiOperation({ summary: 'Resolve a sync conflict' })
  @ApiResponse({ status: 200, description: 'Conflict resolved successfully' })
  async resolveConflict(
    @CurrentUser('id') userId: string,
    @Param('id') conflictId: string,
    @Body() dto: ResolveConflictDto,
  ) {
    return this.offlineSyncService.resolveConflict(userId, conflictId, dto);
  }
}
