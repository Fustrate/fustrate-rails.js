import Listenable from '../listenable';
import { linkTo } from '../utilities';

import '../array-at-polyfill';

interface PaginationData {
  page: number;
  pages: number;
  perPage: number;
  total: number;
}

export interface PaginatedData<T = any> {
  data: T[];
  pagination: PaginationData;
}

const settings = {
  previousText: '← Previous',
  nextText: 'Next →',
};

// Just add 'page='
function getPreppedPaginationURL() {
  const url = window.location.search.replace(/[&?]page=\d+/, '');

  if (url[0] === '?') {
    return `${window.location.pathname}${url}&`;
  }

  if (url[0] === '&') {
    return `${window.location.pathname}?${url.slice(1, url.length)}&`;
  }

  return `${window.location.pathname}?`;
}

export default class Pagination extends Listenable {
  protected page: number;
  protected pages: number;
  protected total: number;
  protected perPage: number;
  protected base: string;

  public constructor(paginationData: PaginationData) {
    super();

    this.page = paginationData.page;
    this.pages = paginationData.pages;
    this.perPage = paginationData.perPage;
    this.total = paginationData.total;

    this.base = getPreppedPaginationURL();
  }

  protected link(text: string, page: number, attributes: Record<string, any> = {}): string {
    attributes['data-page'] = page;

    return linkTo(text, `${this.base}page=${page}`, attributes);
  }

  protected previousLink(): HTMLLIElement {
    const li = document.createElement('li');
    li.classList.add('previous_page');

    if (this.page === 1) {
      li.classList.add('unavailable');
      li.innerHTML = `<a href="#">${settings.previousText}</a>`;
    } else {
      li.innerHTML = this.link(settings.previousText, this.page - 1, { rel: 'prev' });
    }

    return li;
  }

  protected nextLink(): HTMLLIElement {
    const li = document.createElement('li');
    li.classList.add('next_page');

    if (this.page === this.pages) {
      li.classList.add('unavailable');
      li.innerHTML = `<a href="#">${settings.nextText}</a>`;
    } else {
      li.innerHTML = this.link(settings.nextText, this.page + 1, { rel: 'next' });
    }

    return li;
  }

  public generate(): HTMLUListElement {
    const ul = document.createElement('ul');
    ul.classList.add('pagination');

    ul.dataset.pages = String(this.pages);
    ul.dataset.page = String(this.page);

    ul.append(this.previousLink());

    this.windowedPageNumbers().forEach((page) => {
      const li = document.createElement('li');

      if (page === this.page) {
        li.classList.add('current');
        li.innerHTML = linkTo(String(page), '#');
      } else if (page === 'gap') {
        li.classList.add('unavailable');
        li.innerHTML = '<span class="gap">…</span>';
      } else {
        li.innerHTML = this.link(String(page), Number(page));
      }

      ul.append(li);
    });

    ul.append(this.nextLink());

    return ul;
  }

  protected windowedPageNumbers(): (string|number)[] {
    if (this.pages === 1) {
      return [1];
    }

    let pages = [];

    let windowFrom = this.page - 4;
    let windowTo = this.page + 4;

    if (windowTo > this.pages) {
      windowFrom -= windowTo - this.pages;
      windowTo = this.pages;
    }

    if (windowFrom < 1) {
      windowTo += 1 - windowFrom;
      windowFrom = 1;

      if (windowTo > this.pages) {
        windowTo = this.pages;
      }
    }

    if (windowFrom > 4) {
      pages = [1, 2, 'gap'];
    } else {
      for (let i = 1; i < windowFrom; i += 1) {
        pages.push(i);
      }
    }

    for (let i = windowFrom; i < windowTo; i += 1) {
      pages.push(i);
    }

    if (this.pages - 3 > pages.at(-1)) {
      pages.push('gap', this.pages - 1, this.pages);
    } else if (pages.at(-1) + 1 <= this.pages) {
      for (let i = pages.at(-1) + 1; i <= this.pages; i += 1) {
        pages.push(i);
      }
    }

    return pages;
  }

  protected static getCurrentPage(): number {
    const matchData = window.location.search.match(/[&?]page=(\d+)/);

    if (matchData != null) {
      return Number(matchData[0]);
    }

    return 1;
  }
}
