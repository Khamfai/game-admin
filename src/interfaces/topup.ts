import { User } from './user';

export interface Topup {
  id: number | null;
  uid: number | null;
  amount: number | null;
  oldBalance?: number | null;
  newBalance?: number | null;
  description?: string | null;
  createdBy?: number | null;
  createdAt?: number | null;
  users?: Partial<User> | null;
}
