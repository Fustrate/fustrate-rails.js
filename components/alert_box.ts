import { delegate } from '../events';
import Listenable from '../listenable';
import { animate } from '../utilities';

function closeAlertBox(event: { target: HTMLElement }) {
  const alertBox = event.target.closest<HTMLDivElement>('.alert-box');

  animate(alertBox, 'fadeOut', { speed: 'faster' }, () => {
    alertBox.remove();
  });

  return false;
}

export default class AlertBox extends Listenable {
  public static initialize(): void {
    delegate(document.body, '.alert-box .close', 'click', closeAlertBox);
  }
}
