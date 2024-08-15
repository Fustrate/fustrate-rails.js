import type GenericPage from './generic-page';

let instance: GenericPage | undefined;

function wrapTableElements() {
  for (const table of document.querySelectorAll('table')) {
    const wrapper = document.createElement('div');

    wrapper.classList.add('responsive-table');

    if (table.parentNode) {
      table.parentNode.insertBefore(wrapper, table);
    }

    wrapper.append(table);
  }
}

function initialize(): void {
  instance?.initialize();

  wrapTableElements();
}

export function start(page?: GenericPage): void {
  instance = page;

  document.addEventListener('DOMContentLoaded', initialize);
}
