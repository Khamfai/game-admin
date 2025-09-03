export interface ResponseData<T = unknown> {
  status: 'success' | 'fail' | 'error';
  code: string;
  message: string;
  total?: number | null;
  data: T;
}
