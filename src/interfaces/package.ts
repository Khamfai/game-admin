import { Game } from './game';
import { Provider } from './provider';

export interface Package {
  id?: number | null;
  providerId: number | null;
  gameId: number | null;
  sourceId: string | null;
  packageName: string;
  quantity?: number | null;
  sourcePrice: number;
  price: number;
  discount?: number | null;
  image?: string | null;
  description?: string | null;
  otp_path?: string | null;
  isManual: boolean | null;
  isEnable: boolean | null;
  isDelete?: boolean | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  games?: Partial<Game> | null;
  // spacialPackages: Partial<SpacialPackage>[] | null;
  providers?: Partial<Provider> | null;
  _count?: {
    spacialPackages: number;
  };
}
