import { delegate, fire } from '@rails/ujs';

import Listenable from '../listenable';

function toggleDisclosure(event) {
  const disclosure = event.target.closest('.disclosure');
  const isOpen = disclosure.classList.contains('open');

  disclosure.classList.toggle('open');

  fire(disclosure, `${isOpen ? 'closed' : 'opened'}.disclosure`);

  return false;
}

export default class Disclosure extends Listenable {
  static initialize() {
    delegate(document.body, '.disclosure-title', 'click', toggleDisclosure);
  }
}
