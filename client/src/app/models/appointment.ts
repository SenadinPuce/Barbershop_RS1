import { AppointmentType } from './appointmentType';
import { Barber } from './barber';
import { Client } from './client';

export interface Appointment {
  id: number;
  startsAt: Date;
  endsAt: Date;
  duration: number;
  appointmentTypeId: number;
  barberId: number;
  clientId: number;
  appointmentType: AppointmentType;
  client: Client;
  barber: Barber;
  appointmentStatusId: number;
  note: string;
}
