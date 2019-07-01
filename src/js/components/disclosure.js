import { delegate, fire } from '@rails/ujs';

import Component from '../component';

export default class Disclosure extends Component {
  static initialize() {
    delegate(document.body, '.disclosure-title', 'click', this.toggleDisclosure);
  }

  static toggleDisclosure(event) {
    const disclosure = event.target.closest('.disclosure');
    const isOpen = disclosure.classList.contains('open');

    disclosure.classList.toggle('open');

    fire(disclosure, `${isOpen ? 'closed' : 'opened'}.disclosure`);

    return false;
  }
}
