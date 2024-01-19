/* eslint-disable max-classes-per-file */

import Listenable from '../listenable';
import { animate, icon as createIcon } from '../utilities';

type FlashType = 'info' | 'success' | 'error' | 'plain';

const fadeInSettings = { speed: 'faster' } as const;
const fadeOutSettings = { speed: 'slow', delay: 4 } as const;

function createFlashBar(message: string, options: { type: string, icon?: string }) {
  const bar = document.createElement('div');

  bar.classList.add('flash', options.type || 'info');
  bar.innerHTML = options?.icon ? `${createIcon(options.icon)} ${message}` : message;

  document.querySelector('#flashes')?.prepend(bar);

  return bar;
}

export default class Flash extends Listenable {
  protected constructor(message: string, options: { type: FlashType, icon?: string }) {
    super();

    const bar = createFlashBar(message, options);

    animate(bar, 'fadeIn', fadeInSettings, () => {
      animate(bar, 'fadeOut', fadeOutSettings, () => {
        bar.remove();
      });
    });
  }

  public static error(message: string, options?: { icon?: string }): Flash {
    return new this(message, { type: 'error', ...options });
  }

  public static info(message: string, options?: { icon?: string }): Flash {
    return new this(message, { type: 'info', ...options });
  }

  public static plain(message: string, options?: { icon?: string }): Flash {
    return new this(message, { type: 'plain', ...options });
  }

  public static success(message: string, options?: { icon?: string }): Flash {
    return new this(message, { type: 'success', ...options });
  }
}
