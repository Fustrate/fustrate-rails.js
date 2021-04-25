import { createPopper } from '@popperjs/core';
import { delegate } from '@rails/ujs';

import Component from '../component';

export default class Dropdown extends Component {
  static initialize() {
    delegate(document.body, '.has-dropdown', 'click', this.open.bind(this));

    this.boundHide = this.hide.bind(this);
  }

  static open(event) {
    // Hide any visible dropdowns before showing this one
    this.hide();

    this.popper = createPopper(event.target, event.target.nextElementSibling, {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'flip',
          options: {
            behavior: ['bottom', 'top'],
          }
        },
      ],
    });

    document.body.addEventListener('click', this.boundHide);

    return false;
  }

  static hide() {
    if (this.popper) {
      this.popper.destroy();
    }

    document.body.removeEventListener('click', this.boundHide);
  }
}
