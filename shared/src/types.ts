export interface ServiceResponse<T> {
  data?: T;
  error?: string;
  statusCode: number;
}
