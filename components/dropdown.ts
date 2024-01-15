import { createPopper, type Instance } from '@popperjs/core';

import { delegate } from '../events';
import Listenable from '../listenable';

export default class Dropdown extends Listenable {
  private static popper: Instance;
  private static boundHide: any;

  public static initialize(): void {
    delegate(document.body, '.has-dropdown', 'click', this.open.bind(this));

    this.boundHide = this.hide.bind(this);
  }

  protected static open(event: UIEvent & { target: HTMLElement }): false {
    // Hide any visible dropdowns before showing this one
    this.hide();

    this.popper = createPopper(event.target, event.target.nextElementSibling as HTMLElement, {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'flip',
          options: {
            behavior: ['bottom', 'top'],
          },
        },
      ],
    });

    document.body.addEventListener('click', this.boundHide);

    return false;
  }

  protected static hide(): void {
    if (this.popper) {
      this.popper.destroy();
    }

    document.body.removeEventListener('click', this.boundHide);
  }
}
