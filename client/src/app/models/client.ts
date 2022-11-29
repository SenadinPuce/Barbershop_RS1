import { Photo } from './photo';
import { User } from './user';

export class Client extends User {
  smsNotification: boolean;
  emailNotification: boolean;
}
