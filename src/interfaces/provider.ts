export interface Provider {
  id?: number | null;
  name: string;
  url: string;
  apiKey: string;
  callBackUrl?: string | null;
  increment?: number | null;
  excRate: number;
  curr: string | null;
  balance?: number | null;
  isEnable: boolean | null;
  isDelete?: boolean | null;
  createdAt?: number | null;
  updatedAt?: number | null;
}
