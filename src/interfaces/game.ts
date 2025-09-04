import { Provider } from './provider';

export interface Game {
  id?: number | null;
  providerId: number | null;
  sourceId: string | null;
  name: string | null;
  image: string | null;
  type: string | null;
  serviceCode: string | null;
  isEnable: boolean | null;
  isDelete?: boolean | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  _count?: {
    packages?: number;
  };
  providers?: Partial<Provider> | null;
}
