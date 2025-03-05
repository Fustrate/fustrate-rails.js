import { elementFromString, escapeMultilineHTML, tag } from '../html';

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
