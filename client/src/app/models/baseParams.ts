export class BaseParams {
  page = 1;
  pageSize = 10;
  search = '';
  sortBy = '';

  constructor(pageSize?: number) {
    this.pageSize = pageSize;
  }
}
