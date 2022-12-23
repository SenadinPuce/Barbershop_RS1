import { Photo } from './photo';

export class User {
  id: number;
  username: string;
  dateOfBirth: Date;
  token: string;
  role: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  photo?: Photo;
  clientId?: number;
}
