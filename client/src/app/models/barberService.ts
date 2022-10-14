import { Barber } from './barber';
import { Service } from './service';

export interface BarberService {
  id: number;
  barberId: number;
  barber: Barber;
  serviceId: number;
  service: Service;
  price: number;
}
