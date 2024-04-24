import GenericPage from './generic-page';
import Pagination from './components/pagination';
import { elementFromString } from './html';
import { deepExtend } from './object';

import { type PaginatedData } from './components/pagination';

export interface GenericTableSettings {
  [s: string]: any;
  blankRow?: string;
  noRecordsMessage?: string;
}

export { type PaginatedData } from './components/pagination';

type SortFunction<T extends HTMLElement = HTMLElement> = (row: T) => string;

const defaultSortFunction: SortFunction = (row) => row.textContent ?? '';

function sortRows<T extends HTMLElement = HTMLElement>(
  rows: T[],
  sortFunction: SortFunction<T> = defaultSortFunction,
) {
  const rowsWithSortOrder: [string, T][] = rows.map((row) => [sortFunction(row), row]);

  rowsWithSortOrder.sort((x, y) => {
    if (x[0] === y[0]) {
      return 0;
    }

    return x[0] > y[0] ? 1 : -1;
  });

  return rowsWithSortOrder.map((row) => row[1]);
}

const noRecordsMessage = 'No records found.';

const defaultSettings = {
  blankRow: '<tr></tr>',
};

export default abstract class GenericTable<T, U extends HTMLElement = HTMLTableRowElement> extends GenericPage {
  protected table: HTMLTableElement;
  protected tbody: HTMLTableSectionElement;
  protected settings: GenericTableSettings;

  protected static blankRow: string;
  protected static noRecordsMessage: string;

  public constructor(tableSelector: string, settings: GenericTableSettings) {
    super();

    this.table = document.body.querySelector(tableSelector)!;
    [this.tbody] = this.table.tBodies;
    this.settings = deepExtend({}, defaultSettings, settings);
  }

  protected abstract reloadTable(): Promise<void>;

  protected abstract updateRow(row: U, item: T): void;

  public override async initialize(): Promise<any> {
    await super.initialize();

    await this.reloadTable();
  }

  protected createRow(item: T): U {
    const row = elementFromString<U>(this.settings.blankRow!);

    this.updateRow(row, item);

    return row;
  }

  protected reloadRows(trs: U[], options?: { sort?: SortFunction<U> }): void {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove();
    });

    if (trs.length > 0) {
      (options?.sort ? sortRows<U>(trs, options.sort) : trs).forEach((tr) => {
        this.tbody.append(tr);
      });
    }

    this.updated();
  }

  protected addRow(row: U): void {
    this.tbody.append(row);

    this.updated();
  }

  protected removeRow(row: U): void {
    row.remove();

    this.updated();
  }

  protected updated(): void {
    if (this.tbody.querySelectorAll('tr').length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');

      tr.classList.add('no-records');

      td.colSpan = 16;
      td.textContent = this.settings.noRecordsMessage ?? noRecordsMessage;

      tr.append(td);
      this.tbody.append(tr);
    }
  }

  protected getCheckedIds(): string[] {
    return [...this.tbody.querySelectorAll<HTMLInputElement>('td:first-child input:checked')]
      .map((input) => input.value);
  }

  protected checkAll(event: Event & { target: HTMLInputElement }): void {
    const check = event ? event.target.checked : true;

    this.table.querySelectorAll<HTMLInputElement>('td:first-child input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = check;
    });
  }

  protected uncheckAll(): void {
    this.table.querySelectorAll<HTMLInputElement>('td:first-child input:checked').forEach((input) => {
      input.checked = false;
    });
  }

  // This should be fed a response from a JSON request for a paginated listing.
  protected updatePagination(responseData: PaginatedData): void {
    if (!responseData.pagination) {
      return;
    }

    const ul = new Pagination(responseData.pagination).generate();

    document.body.querySelectorAll('.pagination').forEach((oldPagination) => {
      oldPagination.parentNode!.replaceChild(ul.cloneNode(true), oldPagination);
    });
  }
}
