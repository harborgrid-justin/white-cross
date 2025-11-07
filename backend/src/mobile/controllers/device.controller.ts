import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { NotificationService } from '../services/notification.service';
import { RegisterDeviceDto, MobileUpdatePreferencesDto } from '../dto';

/**
 * Device Controller
 * Handles mobile device registration and management
 */
@ApiTags('mobile-devices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mobile/devices')
export class DeviceController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Register a mobile device for push notifications' })
  @ApiResponse({ status: 201, description: 'Device registered successfully' })
  async registerDevice(
    @CurrentUser('id') userId: string,
    @Body() dto: RegisterDeviceDto,
  ) {
    return this.notificationService.registerDeviceToken(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user registered devices' })
  @ApiResponse({ status: 200, description: 'Devices retrieved successfully' })
  async getUserDevices(@CurrentUser('id') userId: string) {
    return this.notificationService.getUserDevices(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Unregister a device' })
  @ApiResponse({ status: 200, description: 'Device unregistered successfully' })
  async unregisterDevice(
    @CurrentUser('id') userId: string,
    @Param('id') tokenId: string,
  ) {
    return this.notificationService.unregisterDeviceToken(userId, tokenId);
  }

  @Put(':id/preferences')
  @ApiOperation({ summary: 'Update device notification preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  async updatePreferences(
    @CurrentUser('id') userId: string,
    @Param('id') tokenId: string,
    @Body() dto: MobileUpdatePreferencesDto,
  ) {
    return this.notificationService.updatePreferences(userId, tokenId, dto);
  }
}
