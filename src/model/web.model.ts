export class WebResponse<T> {
  data?: T;
  error?: string;
  paging?: Paging;
}

export class Paging {
  size: number;
  total_page: number;
  current_page: number;
}
