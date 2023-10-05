import { PaginatedData } from './components/pagination';
import type GenericPage from './generic_page'

export interface GenericTableSettings {
  [s: string]: any;
  blankRow?: string;
  noRecordsMessage?: string;
}

export { PaginatedData };

export default class GenericTable<T, U = HTMLTableRowElement> extends GenericPage {
  protected table: HTMLTableElement;
  protected tbody: HTMLTableSectionElement;
  protected settings: GenericTableSettings;

  protected static blankRow: string;
  protected static noRecordsMessage: string;

  public constructor(tableSelector: string, settings: GenericTableSettings);

  public initialize(): Promise<any>;

  protected addRow(row: U): void;
  protected checkAll(event: Event): void;
  protected createRow(item: T): U;
  protected getCheckedIds(): string[];
  protected reloadRows(trs: U[], options?: { sort?: (row: U) => string }): void;
  protected reloadTable(): void;
  protected removeRow(row: U): void;
  protected uncheckAll(): void;
  protected updated(): void;
  protected updatePagination(responseData: PaginatedData): void;
  protected updateRow(row: U, item: T): void;
}
