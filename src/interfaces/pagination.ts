export interface Pagination {
  page?: number | null;
  limit?: number | null;
  start?: number | null;
  end?: number | null;
  search?: string | null;
}

export interface TablePagination{
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
}
