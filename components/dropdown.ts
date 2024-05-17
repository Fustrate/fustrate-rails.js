import { createPopper, type Instance } from '@popperjs/core';

import { delegate } from '../events';

let popper: Instance | undefined;
let boundHide: any;

function open(event: UIEvent & { target: HTMLElement }): false {
  // Hide any visible dropdowns before showing this one
  hide();

  popper = createPopper(event.target, event.target.nextElementSibling as HTMLElement, {
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

  // The next time we click something on the page, hide the dropdown
  document.body.addEventListener('click', boundHide);

  return false;
}

function hide(): void {
  popper?.destroy();

  document.body.removeEventListener('click', boundHide);
}

export default {
  initialize: () => {
    delegate(document.body, '.has-dropdown', 'click', open.bind(this));

    boundHide = hide.bind(this);
  },
};
