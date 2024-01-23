import { describe, expect, it } from '@jest/globals';

import {
  elementFromString,
} from '../html';

describe('elementFromString', () => {
  it('creates a bare element', () => {
    expect(elementFromString('<input type="color">')).toBeInstanceOf(HTMLInputElement);
  });

  it('creates an element with attributes', () => {
    const element = elementFromString<HTMLInputElement>('<input type="datetime-local" class="date">');

    expect(element).toBeInstanceOf(HTMLInputElement);
    expect(element.type).toBe('datetime-local');
    expect(element.classList.contains('date')).toBe(true);
  });

  it('creates an element with children', () => {
    const element = elementFromString<HTMLTableRowElement>('<tr><td></td><td><input></td><td></td></tr>');

    expect(element).toBeInstanceOf(HTMLTableRowElement);
    expect(element.children).toHaveLength(3);
    expect(element.querySelector('input')).toBeInstanceOf(HTMLInputElement);
  });
});
