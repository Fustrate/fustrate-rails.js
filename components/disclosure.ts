import { delegate, fire } from '../events';
import Listenable from '../listenable';

function toggleDisclosure(event: UIEvent & { target: HTMLElement }): false {
  const disclosure = event.target.closest('.disclosure');

  if (!disclosure) {
    return false;
  }

  const isOpen = disclosure.classList.contains('open');

  disclosure.classList.toggle('open');

  fire(disclosure, `${isOpen ? 'closed' : 'opened'}.disclosure`);

  return false;
}

export default class Disclosure extends Listenable {
  public static initialize(): void {
    delegate(document.body, '.disclosure-title', 'click', toggleDisclosure);
  }
}
