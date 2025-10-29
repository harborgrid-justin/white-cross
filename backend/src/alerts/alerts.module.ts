import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { Alert } from '../database/models/alert.model';
import { AlertPreferences } from '../database/models/alert-preferences.model';
import { DeliveryLog } from '../database/models/delivery-log.model';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([Alert, AlertPreferences, DeliveryLog]),
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
