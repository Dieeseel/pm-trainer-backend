export interface IResponseBody {
  success: boolean;
  statusCode: number;
  message?: string;
  error?: string | [];
  timestamp: string;
}

export interface IResponseBodyWithData extends IResponseBody {
  data: unknown;
}
