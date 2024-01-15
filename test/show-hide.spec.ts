import { describe, expect, it } from '@jest/globals';

import {
  hide,
  // isVisible,
  show,
  toggle,
} from '../show-hide';

// describe('isVisible', () => {
//   it('', () => {});
// });

describe('toggle', () => {
  it('toggles a NodeList of elements', () => {
    const root = document.createElement('div');
    root.append(document.createElement('span'), document.createElement('span'));

    const spans = root.querySelectorAll('span');

    toggle(spans, false);

    expect(spans[0].style.display).toBe('none');
    expect(spans[1].style.display).toBe('none');
  });

  it('toggles a single element', () => {
    const element = document.createElement('div');

    toggle(element, false);

    expect(element.style.display).toBe('none');
  });
});

describe('show', () => {
  it('removes the js-hide class', () => {
    const element = document.createElement('div');
    element.classList.add('js-hide');

    show(element);

    expect(element.classList).toHaveLength(0);
  });

  it('resets the css display property', () => {
    const element = document.createElement('div');
    element.style.display = 'none';

    show(element);

    expect(element.style.display).toBe('block');
  });
});

describe('hide', () => {
  it('removes the css display property', () => {
    const element = document.createElement('div');

    hide(element);

    expect(element.style.display).toBe('none');
  });
});
