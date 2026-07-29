export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  data: null;
  errorDetails?: unknown;
}
