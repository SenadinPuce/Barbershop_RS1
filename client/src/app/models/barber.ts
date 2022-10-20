import { BarberServiceModel } from './barberService';

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
  dateOfBirth: Date;
  barberServices: BarberServiceModel[];
}
