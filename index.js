import '@rails/ujs';

export default class Fustrate {
  static start(Klass) {
    if (Klass) {
      Fustrate.instance = new Klass();
    }

    document.addEventListener('DOMContentLoaded', () => {
      this.initialize();

      if (Klass) {
        Fustrate.instance.initialize();
      }
    });
  }

  static initialize() {
    document.querySelectorAll('table').forEach((table) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('responsive-table');

      table.parentNode.insertBefore(wrapper, table);

      wrapper.appendChild(table);
    });
  }
}
