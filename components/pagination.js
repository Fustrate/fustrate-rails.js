import Listenable from '../listenable';
import { linkTo } from '../utilities';

// Supports: Safari < 15.4 (2022-03-15)
require('core-js/features/array/at');

const settings = {
  previousText: '← Previous',
  nextText: 'Next →',
};

// Just add 'page='
function getPreppedPaginationURL() {
  const url = window.location.search.replace(/[?&]page=\d+/, '');

  if (url[0] === '?') {
    return `${window.location.pathname}${url}&`;
  }

  if (url[0] === '&') {
    return `${window.location.pathname}?${url.slice(1, url.length)}&`;
  }

  return `${window.location.pathname}?`;
}

export default class Pagination extends Listenable {
  constructor(paginationData) {
    super();

    this.page = paginationData.page;
    this.pages = paginationData.pages;
    this.perPage = paginationData.perPage;
    this.total = paginationData.total;

    this.base = getPreppedPaginationURL();
  }

  link(text, page, attributes = {}) {
    attributes['data-page'] = page;

    return linkTo(text, `${this.base}page=${page}`, attributes);
  }

  previousLink() {
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

  nextLink() {
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

  generate() {
    const ul = document.createElement('ul');
    ul.classList.add('pagination');

    ul.dataset.pages = this.pages;
    ul.dataset.page = this.page;

    ul.appendChild(this.previousLink());

    this.windowedPageNumbers().forEach((page) => {
      const li = document.createElement('li');

      if (page === this.page) {
        li.classList.add('current');
        li.innerHTML = linkTo(page, '#');
      } else if (page === 'gap') {
        li.classList.add('unavailable');
        li.innerHTML = '<span class="gap">…</span>';
      } else {
        li.innerHTML = this.link(page, page);
      }

      ul.appendChild(li);
    });

    ul.appendChild(this.nextLink());

    return ul;
  }

  windowedPageNumbers() {
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
      pages.push('gap');
      pages.push(this.pages - 1);
      pages.push(this.pages);
    } else if (pages.at(-1) + 1 <= this.pages) {
      for (let i = pages.at(-1) + 1; i <= this.pages; i += 1) {
        pages.push(i);
      }
    }

    return pages;
  }

  static getCurrentPage() {
    const matchData = window.location.search.match(/[?&]page=(\d+)/);

    if (matchData != null) {
      return parseInt(matchData[0], 10);
    }

    return 1;
  }
}
