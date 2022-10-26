import { Photo } from './photo';

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  photo: Photo;
}
