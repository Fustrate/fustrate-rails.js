import type Listenable from '../listenable';

interface PaginationData {
  page: number;
  pages: number;
  perPage: number;
  total: number;
}

export interface PaginatedData {
  data: any[];
  pagination: PaginationData;
}

export default class Pagination extends Listenable {
  protected page: number;
  protected pages: number;
  protected total: number;
  protected perPage: number;
  protected base: string;

  public constructor(options: PaginationData);

  public generate(): HTMLUListElement;

  protected static getCurrentPage(): number;

  protected link(text: string, page: number, attributes: { [s: string]: any }): string;
  protected nextLink(): HTMLLIElement;
  protected previousLink(): HTMLLIElement;
  protected windowedPageNumbers(): (string|number)[];
}
