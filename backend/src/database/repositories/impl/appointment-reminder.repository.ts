import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AppointmentReminder } from '../../models/appointment-reminder.model';

@Injectable()
export class AppointmentReminderRepository {
  constructor(
    @InjectModel(AppointmentReminder)
    private readonly appointmentReminderModel: typeof AppointmentReminder,
  ) {}

  async findAll(): Promise<AppointmentReminder[]> {
    return this.appointmentReminderModel.findAll();
  }

  async findById(id: string): Promise<AppointmentReminder | null> {
    return this.appointmentReminderModel.findByPk(id);
  }

  async create(
    data: Partial<AppointmentReminder>,
  ): Promise<AppointmentReminder> {
    return this.appointmentReminderModel.create(data);
  }

  async update(
    id: string,
    data: Partial<AppointmentReminder>,
  ): Promise<[number]> {
    return this.appointmentReminderModel.update(data, {
      where: { id },
    });
  }

  async delete(id: string): Promise<number> {
    return this.appointmentReminderModel.destroy({
      where: { id },
    });
  }
}
