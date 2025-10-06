// File: src/types/api.ts
export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data: T;
  meta?: {
    page?: number;
    totalPages?: number;
    total?: number;
    limit?: number;
  };
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  category?: string;
  search?: string;
}
