import GenericPage from './generic_page';
import Pagination from './components/pagination';
import { elementFromString } from './utilities';

function sortRows(rows, sortFunction = () => {}) {
  const rowsWithSortOrder = rows.map(row => [sortFunction(row), row]);

  rowsWithSortOrder.sort((x, y) => {
    if (x[0] === y[0]) {
      return 0;
    }

    return x[0] > y[0] ? 1 : -1;
  });

  return rowsWithSortOrder.map(row => row[1]);
}

export default class GenericTable extends GenericPage {
  constructor(tableSelector) {
    super();

    this.table = document.body.querySelector(tableSelector);
    [this.tbody] = this.table.tBodies;
    this.loadingRow = this.tbody.querySelector('tr.loading');
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

  reloadRows(rows, { sort } = { sort: null }) {
    if (this.loadingRow) {
      this.loadingRow.style.display = 'none';
    }

    if (rows) {
      this.tbody.querySelectorAll('tr:not(.no-records):not(.loading)').forEach((row) => {
        row.parentNode.removeChild(row);
      });

      (sort ? sortRows(rows, sort) : rows).forEach((row) => {
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
    if (this.tbody.querySelectorAll('tr:not(.no-records):not(.loading)').length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');

      tr.classList.add('no-records');

      td.colSpan = 16;
      td.textContent = this.constructor.noRecordsMessage;

      tr.appendChild(td);
      this.tbody.appendChild(tr);
    }
  }

  getCheckedIds() {
    return Array.from(this.tbody.querySelectorAll('td:first-child input:checked'))
      .map(() => this.value);
  }

  checkAll(event) {
    const check = event ? event.target.checked : true;

    this.table.querySelectorAll('td:first-child input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = check;
    });
  }

  uncheckAll() {
    this.table.querySelectorAll('td:first-child input:checked').forEach((input) => {
      input.checked = false;
    });
  }

  // This should be fed a response from a JSON request for a paginated
  // collection.
  updatePagination(data) {
    if (!data.totalPages) {
      return;
    }

    const ul = (new Pagination(data)).generate();

    document.body.querySelectorAll('.pagination').forEach((oldPagination) => {
      oldPagination.parentNode.replaceChild(ul.cloneNode(true), oldPagination);
    });
  }
}
