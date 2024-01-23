// Internal functions
import escape from 'lodash/escape';
import { isBlank } from './string';

type AnimationDelay = 1 | 2 | 3 | 4 | 5;
type AnimationSpeed = 'slow' | 'slower' | 'fast' | 'faster';

function hrefFor(href: any) {
  if (href == null) {
    return '#';
  }

  // A plain string is fine.
  if (typeof href === 'string') {
    return isBlank(href) ? '#' : href;
  }

  // Models have a `path` function.
  if (href.path) {
    return href.path();
  }

  throw new Error(`Invalid href: ${href}`);
}

// Exported functions

export function animate(
  element: HTMLElement,
  animation: string,
  options?: { delay?: AnimationDelay, speed?: AnimationSpeed },
  callback?: () => void,
): void {
  const classes = ['animated', ...animation.split(' ')];

  if (options?.delay) {
    classes.push(`delay-${options.delay}s`);
  }

  if (options?.speed) {
    classes.push(options.speed);
  }

  const scopedClasses = classes.map((name) => `animate__${name}`);

  function handleAnimationEnd() {
    element.classList.remove(...scopedClasses);
    element.removeEventListener('animationend', handleAnimationEnd);

    if (typeof callback === 'function') {
      callback();
    }
  }

  element.addEventListener('animationend', handleAnimationEnd);

  element.classList.add(...scopedClasses);
}

export function hms(seconds: number, zeroDisplay?: string): string {
  if (zeroDisplay && seconds === 0) {
    return zeroDisplay;
  }

  const absolute = Math.abs(seconds);
  const parts = [
    Math.floor(absolute / 3600),
    `0${Math.floor((absolute % 3600) / 60)}`.slice(-2),
    `0${Math.floor(absolute % 60)}`.slice(-2),
  ];

  return `${seconds < 0 ? '-' : ''}${parts.join(':')}`;
}

type FontAwesomeStyle = 'brands' | 'duotone' | 'light' | 'regular' | 'solid' | 'thin';

export function icon(types: string, style?: FontAwesomeStyle): string {
  const classes = types
    .split(' ')
    .map((thing) => `fa-${thing}`)
    .join(' ');

  return `<i class="${style ? `fa-${style}` : 'fa'} ${classes}"></i>`;
}

export function label(text: string, ...classes: string[]): string {
  const cssClasses = classes
    .map((klass) => klass.replace(/[\s_-]+/g, '-').toLowerCase())
    .filter(Boolean);

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add('label', ...cssClasses);

  return span.outerHTML;
}

export function multilineEscapeHTML(string: string | null | undefined): string {
  if (string == null) {
    return '';
  }

  return String(string)
    .split(/\r?\n/)
    .map((line) => escape(line))
    .join('<br />');
}

export function linkTo(text: string, href?: string | any, attributes?: Record<string, any>): string {
  const element = document.createElement('a');

  element.href = hrefFor(href);
  element.innerHTML = text;

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element.outerHTML;
}

export function redirectTo(href: string | any): void {
  window.setTimeout(() => {
    window.location.href = href.path ? href.path() : href;
  }, 750);
}

interface DateTimeLike {
  year: number;
  toFormat: (format: string) => string;
}

export function toHumanDate(dateTimeObject: DateTimeLike, time?: boolean): string {
  const year = dateTimeObject.year === new Date().getFullYear() ? '' : '/yy';

  return dateTimeObject.toFormat(`M/d${year}${time ? ' t' : ''}`);
}
