import {
  elementFromString,
  escapeMultilineHTML,
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

describe('escapeMultilineHTML', () => {
  it('escapes null and undefined', () => {
    expect(escapeMultilineHTML(null)).toBe('');
    expect(escapeMultilineHTML(void 0)).toBe('');
  });

  it('turns newlines into br elements', () => {
    expect(escapeMultilineHTML('The\r\nLos\nAngeles\nDodgers')).toBe(
      'The<br />Los<br />Angeles<br />Dodgers',
    );
  });

  it('escapes entities in a string', () => {
    expect(escapeMultilineHTML('<strong>\'Bob\' `&` "Bill"</strong>\n=/')).toBe(
      '&lt;strong&gt;&#39;Bob&#39; `&amp;` &quot;Bill&quot;&lt;/strong&gt;<br />=/',
    );
  });
});
