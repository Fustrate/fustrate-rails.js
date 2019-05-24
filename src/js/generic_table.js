import GenericPage from './generic_page';
import Pagination from './components/pagination';
import { elementFromString } from './utilities';

export default class GenericTable extends GenericPage {
  constructor(root, table) {
    super(root);

    this.table = table;
    this.tbody = this.table.querySelector('tbody');
    this.loadingRow = this.tbody.querySelector('tr.loading');
    this.noRecordsRow = this.tbody.querySelector('tr.no-records');
  }

  initialize() {
    super.initialize();

    this.reloadTable();
  }

  reloadTable() {}

  createRow(item) {
    const row = elementFromString(this.constructor.blankRow);

    this.updateRow(row, item);

    return row;
  }

  static sortRows(rows, sortFunction = () => {}) {
    const rowsWithSortOrder = rows.map(row => [sortFunction(row), row]);

    rowsWithSortOrder.sort((x, y) => {
      if (x[0] === y[0]) {
        return 0;
      }

      return x[0] > y[0] ? 1 : -1;
    });

    return rowsWithSortOrder.map(row => row[1]);
  }

  reloadRows(rows, { sort } = { sort: null }) {
    if (this.loadingRow) {
      this.loadingRow.style.display = 'none';
    }

    if (rows) {
      this.tbody.querySelectorAll('tr:not(.no-records):not(.loading)').forEach((row) => {
        row.parentNode.removeChild(row);
      });

      (sort ? this.constructor.sortRows(rows, sort) : rows).forEach((row) => {
        this.tbody.appendChild(row);
      });
    }

    this.updated();
  }

  addRow(row) {
    this.tbody.appendChild(row);

    this.updated();
  }

  removeRow(row) {
    row.parentNode.removeChild(row);

    this.updated();
  }

  updated() {
    if (!this.noRecordsRow) {
      return;
    }

    const hasRecords = this.tbody.querySelectorAll('tr:not(.no-records):not(.loading)').length > 0;

    if (hasRecords) {
      this.noRecordsRow.style.display = 'none';
    } else {
      this.noRecordsRow.style.display = '';
    }
  }

  getCheckedIds() {
    return Array.from(this.tbody.querySelectorAll('td:first-child input:checked'))
      .map(() => this.value);
  }

  // This should be fed a response from a JSON request for a paginated
  // collection.
  updatePagination(response) {
    if (!response.totalPages) {
      return;
    }

    const paginationHTML = (new Pagination(response)).generate();

    this.root.querySelectorAll('.pagination').forEach((pagination) => {
      pagination.outerHTML = paginationHTML;
    });
  }
}
