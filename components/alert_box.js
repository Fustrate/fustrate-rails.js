import { delegate } from '../events';
import Listenable from '../listenable';
import { animate } from '../utilities';

function closeAlertBox(event) {
  const alertBox = event.target.closest('.alert-box');

  animate(alertBox, 'fadeOut', { speed: 'faster' }, () => {
    alertBox.remove();
  });

  return false;
}

export default class AlertBox extends Listenable {
  static initialize() {
    delegate(document.body, '.alert-box .close', 'click', closeAlertBox);
  }
}
