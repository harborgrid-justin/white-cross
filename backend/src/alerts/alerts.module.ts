import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { Alert, AlertPreferences, DeliveryLog } from '@/database';
import { AuthModule } from '@/auth';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    SequelizeModule.forFeature([Alert, AlertPreferences, DeliveryLog]),
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
