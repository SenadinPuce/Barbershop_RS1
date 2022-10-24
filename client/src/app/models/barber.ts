import { BarberServiceModel } from './barberService';
import { Photo } from './photo';

export interface Barber {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  age: number;
  phoneNumber: string;
  email: string;
  info: string;
  dateOfBirth: Date;
  barberServices: BarberServiceModel[];
  photo?: Photo;
}
