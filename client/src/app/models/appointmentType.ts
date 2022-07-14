import { Service } from './service';

export interface AppointmentType {
  id: number;
  name: string;
  color: string;
  duration: number;
  services: Service[];
}
