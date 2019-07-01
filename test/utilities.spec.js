import assert from 'assert';
import {
  debounce, elementFromString, escapeHTML, hms, multilineEscapeHTML, redirectTo,
  // animate, icon, label, linkTo, triggerEvent,
  // isVisible, toggle, show, hide, toHumanDate,
} from '../src/js/utilities';

describe('animate', () => {});

describe('debounce', () => {
  jest.useFakeTimers();

  it('waits to run a function', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 2500);

    debounced.call();
    expect(callback).not.toBeCalled();

    // Wait for 1 second and then run again
    jest.runTimersToTime(1000);
    expect(callback).not.toBeCalled();
    debounced.call();

    // Wait for 2.499 seconds
    jest.runTimersToTime(2499);
    expect(callback).not.toBeCalled();

    // 1 more ms and it should run
    jest.runTimersToTime(1);
    expect(callback).toBeCalled();
  });
});

describe('elementFromString', () => {
  it('creates a bare element', () => {
    assert(elementFromString('<input type="color">') instanceof HTMLInputElement);
  });

  it('creates an element with attributes', () => {
    const element = elementFromString('<input type="datetime-local" class="date">');

    assert(element instanceof HTMLInputElement);
    assert.strictEqual(element.type, 'datetime-local');
    assert(element.classList.contains('date'));
  });

  it('creates an element with children', () => {
    const element = elementFromString('<tr><td></td><td><input></td><td></td></tr>');

    assert(element instanceof HTMLTableRowElement);
    assert.strictEqual(element.children.length, 3);
    assert(element.querySelector('input') instanceof HTMLInputElement);
  });
});

describe('escapeHTML', () => {
  it('escapes null and undefined', () => {
    assert.strictEqual(escapeHTML(null), '');
    assert.strictEqual(escapeHTML(undefined), '');
  });

  it('escapes entities in a string', () => {
    assert.strictEqual(
      escapeHTML('<strong>\'Bob\' `&` "Bill"</strong> =/'),
      '&lt;strong&gt;&#39;Bob&#39; &#x60;&amp;&#x60; &quot;Bill&quot;&lt;&#x2F;strong&gt; &#x3D;&#x2F;',
    );
  });
});

describe('hms', () => {
  it('formats zero properly', () => {
    assert.strictEqual(hms(0), '0:00:00');
    assert.strictEqual(hms(0, '-'), '-');
  });

  it('formats positive numbers', () => {
    assert.strictEqual(hms(1), '0:00:01');
    assert.strictEqual(hms(61), '0:01:01');
    assert.strictEqual(hms(5025), '1:23:45');
    assert.strictEqual(hms(86400), '24:00:00');
  });

  it('formats negative numbers', () => {
    assert.strictEqual(hms(-1), '-0:00:01');
    assert.strictEqual(hms(-61), '-0:01:01');
    assert.strictEqual(hms(-5025), '-1:23:45');
    assert.strictEqual(hms(-86400), '-24:00:00');
  });
});

describe('icon', () => {});
describe('label', () => {});

describe('multilineEscapeHTML', () => {
  it('escapes null and undefined', () => {
    assert.strictEqual(multilineEscapeHTML(null), '');
    assert.strictEqual(multilineEscapeHTML(undefined), '');
  });

  it('turns newlines into br elements', () => {
    assert.strictEqual(
      multilineEscapeHTML('The\r\nLos\nAngeles\nDodgers'),
      'The<br />Los<br />Angeles<br />Dodgers',
    );
  });

  it('escapes entities in a string', () => {
    assert.strictEqual(
      multilineEscapeHTML('<strong>\'Bob\' `&` "Bill"</strong>\n=/'),
      '&lt;strong&gt;&#39;Bob&#39; &#x60;&amp;&#x60; &quot;Bill&quot;&lt;&#x2F;strong&gt;<br />&#x3D;&#x2F;',
    );
  });
});

describe('linkTo', () => {});

describe('redirectTo', () => {
  jest.useFakeTimers();

  global.window = Object.create(window);

  Object.defineProperty(window, 'location', {
    value: { href: 'https://github.com' },
    writable: true,
  });

  it('redirects after 750ms', () => {
    redirectTo('https://google.com');

    assert.strictEqual(window.location.href, 'https://github.com');

    // Wait for 749ms
    jest.runTimersToTime(749);
    assert.strictEqual(window.location.href, 'https://github.com');

    // 1 more ms and it should run
    jest.runTimersToTime(1);
    assert.strictEqual(window.location.href, 'https://google.com');
  });
});

describe('triggerEvent', () => {});
describe('isVisible', () => {});
describe('toggle', () => {});
describe('show', () => {});
describe('hide', () => {});
describe('toHumanDate', () => {});
