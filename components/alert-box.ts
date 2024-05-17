import { delegate } from '../events';
import { animate } from '../utilities';

function closeAlertBox(event: { target: HTMLElement }) {
  const alertBox = event.target.closest<HTMLDivElement>('.alert-box');

  if (alertBox == null) {
    return false;
  }

  animate(alertBox, 'fadeOut', { speed: 'faster' }, () => {
    alertBox.remove();
  });

  return false;
}

export function initialize(): void {
  delegate(document.body, '.alert-box .close', 'click', closeAlertBox);
}
