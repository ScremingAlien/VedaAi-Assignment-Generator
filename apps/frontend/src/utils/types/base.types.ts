export type ApiResponse<T> = {
  status: boolean;
  data: T;
  message: string;
  timestamp: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
