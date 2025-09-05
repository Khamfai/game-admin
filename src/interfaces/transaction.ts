import { Package } from './package';
import { User } from './user';

export interface Transaction {
  id?: number | null;
  orderId: string;
  uid: number | null;
  packageId?: number | null;
  cusGameId?: string | null;
  gameServerId?: string | null;
  phone: string | null;
  sourcePrice: number | null;
  profit: number | null;
  amount: number | null;
  discount: number | null;
  total: number | null;
  balance: number | null;
  status: number; // 0: pending, 1: success, 2: cancelled, 3: refund
  description: string | null;
  percent: number;
  updatedBy: number | null;
  isDelete: boolean | null;
  createdAt: number | null;
  updatedAt: number | null;

  users?: Partial<User> | null;
  packages?: Partial<Package> | null;
}
