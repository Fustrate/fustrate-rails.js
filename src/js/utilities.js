// Internal functions
import escape from 'lodash/escape';
import { isBlank } from './string';

function hrefFor(href) {
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

export const animate = (element, animation, { delay, speed } = {}, callback = null) => {
  const classes = ['animated', ...animation.split(' ')];

  if (delay) {
    classes.push(`delay-${delay}s`);
  }

  // slow, slower, fast, faster
  if (speed) {
    classes.push(speed);
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
};

export const elementFromString = (string) => {
  const template = document.createElement('template');

  template.innerHTML = string.trim();

  return template.content.firstChild;
};

export function hms(seconds, zeroDisplay) {
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

export const icon = (types, style = 'regular') => {
  const classes = types
    .split(' ')
    .map((thing) => `fa-${thing}`)
    .join(' ');

  return `<i class="fa${style[0]} ${classes}"></i>`;
};

export const label = (text, classes = '') => {
  const cssClasses = (Array.isArray(classes) ? classes : classes.split(' '))
    .map((klass) => klass.replace(/\s+/g, '-').toLowerCase())
    .filter(Boolean);

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add('label', ...cssClasses);

  return span.outerHTML;
};

export const multilineEscapeHTML = (string) => {
  if (string == null) {
    return '';
  }

  return String(string)
    .split(/\r?\n/)
    .map((line) => escape(line))
    .join('<br />');
};

export const linkTo = (text, href, attributes = {}) => {
  const element = document.createElement('a');

  element.href = hrefFor(href);
  element.innerHTML = text;

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element.outerHTML;
};

export const redirectTo = (href) => {
  window.setTimeout(() => {
    window.location.href = href.path ? href.path() : href;
  }, 750);
};

export const toHumanDate = (dateTimeObject, time = false) => {
  const year = dateTimeObject.year !== new Date().getFullYear() ? '/yy' : '';

  return dateTimeObject.toFormat(`M/d${year}${time ? ' t' : ''}`);
};
