export interface ResponseData<T = unknown> {
  status: 'success' | 'fail' | 'error';
  code: number;
  message: string;
  total?: number | null;
  data: T;
}
