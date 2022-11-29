import { User } from '../models/user';

export function getFullName(user: User) {
  if (!user) {
    return '';
  }
  return user.firstName + ' ' + user.lastName;
}
