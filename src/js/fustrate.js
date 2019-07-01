import moment from 'moment';

require('./polyfills');

export default class Fustrate {
  static start(instance) {
    Fustrate.instance = instance;

    document.addEventListener('DOMContentLoaded', () => {
      this.initialize();

      instance.initialize();
    });
  }

  constructor() {
    moment.updateLocale('en', {
      longDateFormat: {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'M/D/YY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A',
      },
      calendar: {
        lastDay: '[Yesterday at] LT',
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        lastWeek: 'dddd [at] LT',
        nextWeek: '[next] dddd [at] LT',
        sameElse: 'L',
      },
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
