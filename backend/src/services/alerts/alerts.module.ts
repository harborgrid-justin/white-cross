import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { AlertDeliveryService } from './services/alert-delivery.service';
import { AlertPreferencesService } from './services/alert-preferences.service';
import { AlertStatisticsService } from './services/alert-statistics.service';
import { AlertRetryService } from './services/alert-retry.service';
import { Alert, AlertPreferences, DeliveryLog } from '@/database';
import { AuthModule } from '../auth';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    SequelizeModule.forFeature([Alert, AlertPreferences, DeliveryLog]),
  ],
  controllers: [AlertsController],
  providers: [
    AlertsService,
    AlertDeliveryService,
    AlertPreferencesService,
    AlertStatisticsService,
    AlertRetryService,
  ],
  exports: [AlertsService],
})
export class AlertsModule {}
