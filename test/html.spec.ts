import { elementFromString, escapeMultilineHTML, setChildren, stripHTML, tag, toggleAttribute } from '../html';
import { describe, it, expect } from 'vitest';

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

  it('creates a table row element with children', () => {
    const element = elementFromString<HTMLTableRowElement>('<tr><td></td><td><input></td><td></td></tr>');

    expect(element).toBeInstanceOf(HTMLTableRowElement);
    expect(element.children).toHaveLength(3);
    expect(element.querySelector('input')).toBeInstanceOf(HTMLInputElement);
  });

  it('creates a table cell element', () => {
    const element = elementFromString<HTMLTableCellElement>('<td>hello</td>');

    expect(element).toBeInstanceOf(HTMLTableCellElement);
    expect(element.textContent).toBe('hello');
  });
});

describe('escapeMultilineHTML', () => {
  it('escapes null and undefined', () => {
    expect(escapeMultilineHTML(null)).toBe('');
    expect(escapeMultilineHTML(void 0)).toBe('');
  });

  it('turns newlines into br elements', () => {
    expect(escapeMultilineHTML('The\r\nLos\nAngeles\nDodgers')).toBe('The<br />Los<br />Angeles<br />Dodgers');
  });

  it('escapes entities in a string', () => {
    expect(escapeMultilineHTML('<strong>\'Bob\' `&` "Bill"</strong>\n=/')).toBe(
      '&lt;strong&gt;&#39;Bob&#39; `&amp;` &quot;Bill&quot;&lt;/strong&gt;<br />=/',
    );
  });
});

describe('setChildren', () => {
  it('replaces all children of the parent element', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<span>old</span>';

    const p1 = document.createElement('p');
    p1.textContent = 'new1';
    const p2 = document.createElement('p');
    p2.textContent = 'new2';

    setChildren(parent, [p1, p2]);

    expect(parent.children).toHaveLength(2);
    expect(parent.children[0].textContent).toBe('new1');
    expect(parent.children[1].textContent).toBe('new2');
  });

  it('clears all existing children when given an empty array', () => {
    const parent = document.createElement('div');
    parent.innerHTML = '<span>one</span><span>two</span>';

    setChildren(parent, []);

    expect(parent.children).toHaveLength(0);
  });
});

describe('stripHTML', () => {
  it('strips HTML tags leaving only text content', () => {
    expect(stripHTML('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });

  it('returns plain text unchanged', () => {
    expect(stripHTML('Hello world')).toBe('Hello world');
  });

  it('returns an empty string for a tag with no text', () => {
    expect(stripHTML('<br>')).toBe('');
  });
});

describe('toggleAttribute', () => {
  it('sets the attribute when enabled is true', () => {
    const input = document.createElement('input');

    toggleAttribute(input, 'disabled', true);

    expect(input.getAttribute('disabled')).toBe('disabled');
  });

  it('removes the attribute when enabled is false', () => {
    const input = document.createElement('input');
    input.setAttribute('disabled', 'disabled');

    toggleAttribute(input, 'disabled', false);

    expect(input.hasAttribute('disabled')).toBe(false);
  });

  it('does not add the attribute when already absent and enabled is false', () => {
    const input = document.createElement('input');

    toggleAttribute(input, 'required', false);

    expect(input.hasAttribute('required')).toBe(false);
  });
});

describe('tag', () => {
  it('creates a basic tag', () => {
    expect(tag.div().outerHTML).toBe('<div></div>');
  });

  it('creates an input tag with a value', () => {
    expect(tag.input({ attributes: { type: 'text', value: 'hello' } }).outerHTML).toBe(
      '<input type="text" value="hello">',
    );

    expect(tag.input({ attributes: { type: 'text', value: null } }).outerHTML).toBe('<input type="text">');
  });

  it('creates a tag with classes', () => {
    expect(tag.span({ class: 'green red' }).outerHTML).toBe('<span class="green red"></span>');

    expect(tag.span({ class: ['green', 'red'] }).outerHTML).toBe('<span class="green red"></span>');

    expect(tag.span({ class: ['green red', 'blue'] }).outerHTML).toBe('<span class="green red blue"></span>');

    expect(tag.span({ class: ['green red', 'blue yellow'] }).outerHTML).toBe(
      '<span class="green red blue yellow"></span>',
    );
  });
});
