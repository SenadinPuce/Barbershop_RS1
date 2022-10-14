import { BarberService } from './barberService';

export interface Barber {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  age: number;
  phoneNumber: string;
  email: string;
  info: string;
  photoUrl: string;
  barberServices: BarberService[];
}
