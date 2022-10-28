export interface Pagination {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  result: T;
  pagination: Pagination;
}
