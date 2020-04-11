/* eslint-disable max-classes-per-file */

import Component from '../component';
import { animate, icon as createIcon } from '../utilities';

const fadeInSettings = { speed: 'faster' };
const fadeOutSettings = { speed: 'slow', delay: 4 };

function createFlashBar(message, { type, icon } = {}) {
  const bar = document.createElement('div');

  bar.classList.add('flash', type || 'info');
  bar.innerHTML = icon ? `${createIcon(icon)} ${message}` : message;

  const flashes = document.getElementById('flashes');

  flashes.insertBefore(bar, flashes.firstChild);

  return bar;
}

export class Flash extends Component {
  constructor(message, { type, icon } = {}) {
    super();

    const bar = createFlashBar(message, { type, icon });

    animate(bar, 'fadeIn', fadeInSettings, () => {
      animate(bar, 'fadeOut', fadeOutSettings, () => {
        bar.remove();
      });
    });
  }

  static show(message, { type, icon } = {}) {
    return new this(message, { type, icon });
  }
}

export class InfoFlash extends Flash {
  constructor(message, { icon } = {}) {
    super(message, { type: 'info', icon });
  }
}

export class SuccessFlash extends Flash {
  constructor(message, { icon } = {}) {
    super(message, { type: 'success', icon });
  }
}

export class ErrorFlash extends Flash {
  constructor(message, { icon } = {}) {
    super(message, { type: 'error', icon });
  }
}
