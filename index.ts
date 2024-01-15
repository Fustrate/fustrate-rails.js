import type GenericPage from './generic-page';

function wrapTableElements() {
  document.querySelectorAll('table').forEach((table) => {
    const wrapper = document.createElement('div');

    wrapper.classList.add('responsive-table');

    table.parentNode.insertBefore(wrapper, table);

    wrapper.append(table);
  });
}

export default class Fustrate {
  public static instance: GenericPage;

  public static start(Klass: typeof GenericPage): void {
    if (Klass) {
      Fustrate.instance = new Klass();
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
