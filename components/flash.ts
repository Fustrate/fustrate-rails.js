/* eslint-disable max-classes-per-file */

import Listenable from '../listenable';
import { animate, icon as createIcon } from '../utilities';

const fadeInSettings = { speed: 'faster' } as const;
const fadeOutSettings = { speed: 'slow', delay: 4 } as const;

function createFlashBar(message: string, options: { type: string, icon?: string }) {
  const bar = document.createElement('div');

  bar.classList.add('flash', options.type || 'info');
  bar.innerHTML = options?.icon ? `${createIcon(options.icon)} ${message}` : message;

  document.querySelector('#flashes')?.prepend(bar);

  return bar;
}

export class Flash extends Listenable {
  protected constructor(message: string, options: { type: string, icon?: string }) {
    super();

    const bar = createFlashBar(message, options);

    animate(bar, 'fadeIn', fadeInSettings, () => {
      animate(bar, 'fadeOut', fadeOutSettings, () => {
        bar.remove();
      });
    });
  }

  public static show(message: string, options?: { type?: string, icon?: string }): Flash {
    return new this(message, { type: 'plain', ...options });
  }
}

export class InfoFlash extends Flash {
  protected constructor(message: string, options?: { icon?: string }) {
    super(message, { type: 'info', ...options });
  }
}

export class SuccessFlash extends Flash {
  protected constructor(message: string, options?: { icon?: string }) {
    super(message, { type: 'success', ...options });
  }
}

export class ErrorFlash extends Flash {
  protected constructor(message: string, options?: { icon?: string }) {
    super(message, { type: 'error', ...options });
  }
}
