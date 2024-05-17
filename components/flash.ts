import { tag } from '../html';
import { animate, icon as createIcon } from '../utilities';

type FlashType = 'info' | 'success' | 'error' | 'plain';

let container: HTMLDivElement | null;

const fadeInSettings = { speed: 'faster' } as const;
const fadeOutSettings = { speed: 'slow', delay: 4 } as const;

function createFlash(message: string, options: { type: FlashType; icon?: string }): void {
  const bar = document.createElement('div');

  bar.classList.add('flash', options.type);
  bar.innerHTML = options.icon ? `${createIcon(options.icon)} ${message}` : message;

  container?.prepend(bar);

  animate(bar, 'fadeIn', fadeInSettings, () => {
    animate(bar, 'fadeOut', fadeOutSettings, () => {
      bar.remove();
    });
  });
}

export default {
  error: (message: string, options?: { icon?: string }) => {
    createFlash(message, { type: 'error', ...options });
  },
  info: (message: string, options?: { icon?: string }) => {
    createFlash(message, { type: 'info', ...options });
  },
  plain: (message: string, options?: { icon?: string }) => {
    createFlash(message, { type: 'plain', ...options });
  },
  success: (message: string, options?: { icon?: string }) => {
    createFlash(message, { type: 'success', ...options });
  },
};

export function initialize(): void {
  container = document.querySelector('#flashes');

  if (container == null) {
    container = tag.div({ attributes: { id: 'flashes' } });

    document.body.append(container);
  }
}
