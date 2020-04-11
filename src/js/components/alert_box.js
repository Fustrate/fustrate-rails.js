import { delegate } from '@rails/ujs';

import Component from '../component';
import { animate } from '../utilities';

export default class AlertBox extends Component {
  static initialize() {
    delegate(document.body, '.alert-box .close', 'click', this.closeAlertBox);
  }

  static closeAlertBox(event) {
    const alertBox = event.target.closest('.alert-box');

    animate(alertBox, 'fadeOut', { speed: 'faster' }, alertBox.remove);

    return false;
  }
}
