import { createPopper, type Instance, type Options, type Placement } from '@popperjs/core';

import { delegate, stopEverything } from '../events';

let popper: Instance | undefined;
let boundHide: any;

let defaultOptions: Partial<Options>;

function open(event: UIEvent & { target: HTMLElement }): false {
  // Hide any visible dropdowns before showing this one
  hide();

  const options = {
    modifiers: [],
    ...defaultOptions,
  };

  if (event.target.dataset.popperPlacement) {
    options.placement = event.target.dataset.popperPlacement as Placement;
  }

  if (event.target.dataset.popperFlip) {
    options.modifiers.push({
      name: 'flip',
      options: {
        behavior: ['bottom', 'top'],
      },
    });
  }

  popper = createPopper(event.target, event.target.nextElementSibling as HTMLElement, options);

  // The next time we click something on the page, hide the dropdown
  document.body.addEventListener('click', boundHide);

  stopEverything(event);

  return false;
}

function hide(): void {
  popper?.destroy();

  document.body.removeEventListener('click', boundHide);
}

export function initialize(options?: Partial<Options>) {
  defaultOptions = options ?? {};

  delegate(document.body, '.has-dropdown', 'click', open);

  boundHide = hide;
}
