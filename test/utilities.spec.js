import {
  debounce,
  elementFromString,
  escapeHTML,
  hms,
  icon,
  label,
  multilineEscapeHTML,
  redirectTo,
  // animate, linkTo, isVisible, toggle, show, hide, toHumanDate,
} from '../src/js/utilities';

describe('animate', () => {
  it('', () => {});
});

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
    expect(elementFromString('<input type="color">')).toBeInstanceOf(HTMLInputElement);
  });

  it('creates an element with attributes', () => {
    const element = elementFromString('<input type="datetime-local" class="date">');

    expect(element).toBeInstanceOf(HTMLInputElement);
    expect(element.type).toEqual('datetime-local');
    expect(element.classList.contains('date')).toBeTruthy();
  });

  it('creates an element with children', () => {
    const element = elementFromString('<tr><td></td><td><input></td><td></td></tr>');

    expect(element).toBeInstanceOf(HTMLTableRowElement);
    expect(element.children).toHaveLength(3);
    expect(element.querySelector('input')).toBeInstanceOf(HTMLInputElement);
  });
});

describe('escapeHTML', () => {
  it('escapes null and undefined', () => {
    expect(escapeHTML(null)).toEqual('');
    expect(escapeHTML(undefined)).toEqual('');
  });

  it('escapes entities in a string', () => {
    expect(escapeHTML('<strong>\'Bob\' `&` "Bill"</strong> =/')).toEqual(
      '&lt;strong&gt;&#39;Bob&#39; &#x60;&amp;&#x60; &quot;Bill&quot;&lt;&#x2F;strong&gt; &#x3D;&#x2F;',
    );
  });
});

describe('hms', () => {
  it('formats zero properly', () => {
    expect(hms(0)).toEqual('0:00:00');
    expect(hms(0, '-')).toEqual('-');
  });

  it('formats positive numbers', () => {
    expect(hms(1)).toEqual('0:00:01');
    expect(hms(61)).toEqual('0:01:01');
    expect(hms(5025)).toEqual('1:23:45');
    expect(hms(86400)).toEqual('24:00:00');
  });

  it('formats negative numbers', () => {
    expect(hms(-1)).toEqual('-0:00:01');
    expect(hms(-61)).toEqual('-0:01:01');
    expect(hms(-5025)).toEqual('-1:23:45');
    expect(hms(-86400)).toEqual('-24:00:00');
  });
});

describe('icon', () => {
  it('creates a basic icon', () => {
    expect(icon('pencil-alt')).toEqual('<i class="far fa-pencil-alt"></i>');
  });

  it('creates an icon with a different style', () => {
    expect(icon('pencil-alt', 'thin')).toEqual('<i class="fat fa-pencil-alt"></i>');
  });

  it('creates an icon with multiple classes', () => {
    expect(icon('pencil-alt 2x')).toEqual('<i class="far fa-pencil-alt fa-2x"></i>');
  });
});

describe('label', () => {
  it('creates a basic label', () => {
    expect(label('Open', 'work-order')).toEqual('<span class="label work-order open">Open</span>');
    expect(label('Open', 'Open')).toEqual('<span class="label open">Open</span>');
  });

  it('creates a label with no type', () => {
    expect(label('Open')).toEqual('<span class="label open">Open</span>');
  });

  it('creates a label with spaces in the text', () => {
    expect(label('Work Order')).toEqual('<span class="label work-order">Work Order</span>');
  });
});

describe('multilineEscapeHTML', () => {
  it('escapes null and undefined', () => {
    expect(multilineEscapeHTML(null)).toEqual('');
    expect(multilineEscapeHTML(undefined)).toEqual('');
  });

  it('turns newlines into br elements', () => {
    expect(multilineEscapeHTML('The\r\nLos\nAngeles\nDodgers')).toEqual(
      'The<br />Los<br />Angeles<br />Dodgers',
    );
  });

  it('escapes entities in a string', () => {
    expect(multilineEscapeHTML('<strong>\'Bob\' `&` "Bill"</strong>\n=/')).toEqual(
      '&lt;strong&gt;&#39;Bob&#39; &#x60;&amp;&#x60; &quot;Bill&quot;&lt;&#x2F;strong&gt;<br />&#x3D;&#x2F;',
    );
  });
});

describe('linkTo', () => {
  it('', () => {});
});

describe('redirectTo', () => {
  jest.useFakeTimers();

  global.window = Object.create(window);

  Object.defineProperty(window, 'location', {
    value: { href: 'https://github.com' },
    writable: true,
  });

  it('redirects after 750ms', () => {
    redirectTo('https://google.com');

    expect(window.location.href).toEqual('https://github.com');

    // Wait for 749ms
    jest.runTimersToTime(749);
    expect(window.location.href).toEqual('https://github.com');

    // 1 more ms and it should run
    jest.runTimersToTime(1);
    expect(window.location.href).toEqual('https://google.com');
  });
});

describe('isVisible', () => {
  it('', () => {});
});

describe('toggle', () => {
  it('', () => {});
});

describe('show', () => {
  it('', () => {});
});

describe('hide', () => {
  it('', () => {});
});

describe('toHumanDate', () => {
  it('', () => {});
});
