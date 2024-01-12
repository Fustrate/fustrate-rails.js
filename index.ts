import type GenericPage from './generic_page';

function wrapTableElements() {
  document.querySelectorAll('table').forEach((table) => {
    const wrapper = document.createElement('div');

    wrapper.classList.add('responsive-table');

    table.parentNode.insertBefore(wrapper, table);

    wrapper.appendChild(table);
  });
}

export default class Fustrate {
  public static instance: GenericPage;

  public static start(klass: typeof GenericPage): void {
    if (klass) {
      Fustrate.instance = new klass();
    }

    document.addEventListener('DOMContentLoaded', this.initialize.bind(this));
  }

  protected static initialize(): void {
    if (Fustrate.instance) {
      Fustrate.instance.initialize();
    }

    wrapTableElements();
  }
}
