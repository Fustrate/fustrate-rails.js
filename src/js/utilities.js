// Internal functions
import { compact } from './array';
import { underscore, isBlank } from './string';

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

function hrefFor(href) {
  if (href === undefined || href === null) {
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

  // I should've commented this. What is this for?
  // if (!(href.type && href.id)) {
  //   return href;
  // }

  throw new Error(`Invalid href: ${href}`);
}

function toggleElement(element, makeVisible) {
  element.style.display = makeVisible ? 'inherit' : 'none';

  if (makeVisible) {
    element.classList.remove('js-hide');
  }
}

// Exported functions

export const animate = (element, animation, callback, { delay, speed } = {}) => {
  const classes = ['animated', animation];

  if (delay) {
    classes.push(`delay-${delay}s`);
  }

  // slow, slower, fast, faster
  if (speed) {
    classes.push(speed);
  }

  function handleAnimationEnd() {
    element.classList.remove(...classes);
    element.removeEventListener('animationend', handleAnimationEnd);

    if (typeof callback === 'function') {
      callback();
    }
  }

  element.addEventListener('animationend', handleAnimationEnd);

  element.classList.add(...classes);
};

export const applyMixin = (target, mixin, options) => {
  // eslint-disable-next-line new-cap
  const instance = new mixin();
  const prototype = Object.getPrototypeOf(instance);

  if (options) {
    Object.getOwnPropertyNames(options).forEach(key => {
      target[key] = options[key];
    });
  }

  // Assign properties to the prototype
  Object.getOwnPropertyNames(prototype).forEach(key => {
    // Mixins can define their own `initialize` and `addEventListeners` methods, which will be
    // added with their mixin name appended, and called at the same time as the original methods.
    const newKey = ['initialize', 'addEventListeners'].includes(key) ? `${key}${mixin.name}` : key;

    if (!target.prototype[newKey]) {
      target.prototype[newKey] = prototype[key];
    }
  }, this);

  // Assign properties to the prototype
  Object.getOwnPropertyNames(prototype.constructor).forEach(key => {
    if (['length', 'name', 'prototype'].includes(key)) {
      return;
    }

    if (!target[key]) {
      target[key] = prototype.constructor[key];
    }
  }, this);

  return target;
};

export const debounce = (func, delay = 250) => {
  let timeout = null;

  return (...args) => {
    const context = this;

    const delayedFunc = () => {
      func.apply(context, args);

      timeout = null;
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(delayedFunc, delay);
  };
};

export const elementFromString = string => {
  const template = document.createElement('template');

  template.innerHTML = string.trim();

  return template.content.firstChild;
};

export const escapeHTML = string => {
  if (string === null || string === undefined) {
    return '';
  }

  return String(string).replace(/[&<>"'`=/]/g, entity => entityMap[entity]);
};

export function hms(seconds, zero) {
  if (zero && (seconds === 0 || seconds === undefined)) {
    return zero;
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
    .map(thing => `fa-${thing}`)
    .join(' ');

  return `<i class="fa${style[0]} ${classes}"></i>`;
};

export const label = (text, type) => {
  const classes = underscore(compact(['label', type, text.replace(/\s+/g, '-')]).join(' '))
    .toLowerCase()
    .split(' ');

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add(...classes);

  return span.outerHTML;
};

export const multilineEscapeHTML = string => {
  if (string === null || string === undefined) {
    return '';
  }

  return String(string)
    .split(/\r?\n/)
    .map(line => escapeHTML(line))
    .join('<br />');
};

export const linkTo = (text, href, options = {}) => {
  const element = document.createElement('a');

  element.href = hrefFor(href);
  element.innerHTML = text;

  Object.keys(options).forEach(key => {
    element.setAttribute(key, options[key]);
  });

  return element.outerHTML;
};

export const redirectTo = href => {
  window.setTimeout(() => {
    window.location.href = href.path ? href.path() : href;
  }, 750);
};

export const isVisible = elem =>
  !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

export const toggle = (element, showOrHide) => {
  if (element instanceof NodeList) {
    element.forEach(elem => {
      toggleElement(elem, showOrHide !== undefined ? showOrHide : !isVisible(elem));
    });
  } else {
    toggleElement(element, showOrHide !== undefined ? showOrHide : !isVisible(element));
  }
};

export const show = element => {
  toggle(element, true);
};

export const hide = element => {
  toggle(element, false);
};

export const toHumanDate = (momentObject, time = false) => {
  // use Date#getFullYear so that we don't have to pull in the moment library
  const year = momentObject.year() !== new Date().getFullYear() ? '/YY' : '';

  return momentObject.format(`M/D${year}${time ? ' h:mm A' : ''}`);
};
