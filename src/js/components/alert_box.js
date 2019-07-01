// jQuery: fadeOut
import $ from 'jquery';
import { delegate } from '@rails/ujs';

import Component from '../component';

const fadeSpeed = 300;

export default class AlertBox extends Component {
  static initialize() {
    delegate(document.body, '.alert-box .close', 'click', this.closeAlertBox);
  }

  static closeAlertBox(event) {
    const alertBox = event.target.closest('.alert-box');

    $(alertBox).fadeOut(fadeSpeed, alertBox.remove);

    return false;
  }
}
