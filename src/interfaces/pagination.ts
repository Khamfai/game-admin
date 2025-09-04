export interface Pagination {
  page?: number | null;
  limit?: number | null;
  start?: number | null;
  end?: number | null;
  search?: string | null;
}

export interface TablePagination {
  sortBy?: string | null;
  descending?: boolean;
  page: number;
  toPage?: number | null;
  rowsPerPage: number;
  rowsNumber: number;
}
