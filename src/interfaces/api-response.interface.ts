export interface IApiResponse<T> {
  ok: true;
  statusCode: number;
  message?: string;
  data: T;
  timestamp: string;
}

export interface IApiErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}
