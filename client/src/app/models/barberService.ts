import { Barber } from './barber';
import { Service } from './service';

export interface BarberServiceModel {
  id: number;
  barberId: number;
  barber: Barber;
  serviceId: number;
  service: Service;
  price: number;
  isNew: boolean;
  availableServices: Service[];
}
