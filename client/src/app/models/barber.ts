import { BarberServiceModel } from './barberService';
import { Photo } from './photo';
import { User } from './user';

export class Barber extends User {
  age: number;
  info: string;
  barberServices: BarberServiceModel[];
}
