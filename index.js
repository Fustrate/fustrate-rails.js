import '@rails/ujs';

function wrapTableElements() {
  document.querySelectorAll('table').forEach((table) => {
    const wrapper = document.createElement('div');

    wrapper.classList.add('responsive-table');

    table.parentNode.insertBefore(wrapper, table);

    wrapper.appendChild(table);
  });
}

export default class Fustrate {
  static start(Klass) {
    if (Klass) {
      Fustrate.instance = new Klass();
    }

    document.addEventListener('DOMContentLoaded', this.initialize);
  }

  static initialize() {
    if (Fustrate.instance) {
      Fustrate.instance.initialize();
    }

    wrapTableElements();
  }
}
