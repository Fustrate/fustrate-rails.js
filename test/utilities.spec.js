import {
  animate,
  debounce,
  elementFromString,
  escapeHTML,
  hide,
  hms,
  icon,
  // isVisible,
  label,
  linkTo,
  multilineEscapeHTML,
  redirectTo,
  show,
  toggle,
  toHumanDate,
} from '../src/js/utilities';

describe('animate', () => {
  it('animates for a while', () => {
    const element = document.createElement('div');

    animate(element, 'wacky');

    expect(element.classList).toContain('animated', 'wacky');

    element.dispatchEvent(new CustomEvent('animationend'));

    expect(element.classList).toHaveLength(0);
  });

  it('animates with a delay and a speed', () => {
    const element = document.createElement('div');

    animate(element, 'wacky', null, { delay: 3, speed: 'fast' });

    expect(element.classList).toContain('animated', 'wacky', 'delay-3s', 'fast');

    element.dispatchEvent(new CustomEvent('animationend'));

    expect(element.classList).toHaveLength(0);
  });
});

describe('debounce', () => {
  jest.useFakeTimers();

  it('waits to run a function', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 2500);

    debounced.call();
    expect(callback).not.toBeCalled();

    // Wait for 1 second and then run again
    jest.advanceTimersByTime(1000);
    expect(callback).not.toBeCalled();
    debounced.call();

    // Wait for 2.499 seconds
    jest.advanceTimersByTime(2499);
    expect(callback).not.toBeCalled();

    // 1 more ms and it should run
    jest.advanceTimersByTime(1);
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
    expect(element.classList.contains('date')).toBe(true);
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
  it('creates a link to undefined/null', () => {
    expect(linkTo('test')).toEqual('<a href="#">test</a>');
    expect(linkTo('test', null)).toEqual('<a href="#">test</a>');
  });

  it('creates a link to a string href', () => {
    expect(linkTo('test', '')).toEqual('<a href="#">test</a>');
    expect(linkTo('test', '/users')).toEqual('<a href="/users">test</a>');
  });

  it('creates a link to an object that responds to #path', () => {
    expect(linkTo('test', { path: () => '/users' })).toEqual('<a href="/users">test</a>');
  });

  it("doesn't like other arguments", () => {
    expect(() => {
      linkTo('test', 5);
    }).toThrowError(/Invalid href: /);

    expect(() => {
      linkTo('test', {});
    }).toThrowError(/Invalid href: /);
  });

  it('creates a link with extra attributes', () => {
    expect(linkTo('test', '#', { 'data-label': 'Test', class: 'antelope' })).toEqual(
      '<a href="#" data-label="Test" class="antelope">test</a>',
    );
  });
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
    jest.advanceTimersByTime(749);
    expect(window.location.href).toEqual('https://github.com');

    // 1 more ms and it should run
    jest.advanceTimersByTime(1);
    expect(window.location.href).toEqual('https://google.com');
  });
});

describe('isVisible', () => {
  it('', () => {});
});

describe('toggle', () => {
  it('toggles a NodeList of elements', () => {
    const root = document.createElement('div');
    root.append(document.createElement('span'), document.createElement('span'));

    const spans = root.querySelectorAll('span');

    toggle(spans, false);

    expect(spans[0].style.display).toEqual('none');
    expect(spans[1].style.display).toEqual('none');
  });

  it('toggles a single element', () => {
    const element = document.createElement('div');

    toggle(element, false);

    expect(element.style.display).toEqual('none');
  });
});

describe('show', () => {
  it('removes the js-hide class', () => {
    const element = document.createElement('div');
    element.classList.add('js-hide');

    show(element);

    expect(element.classList).toHaveLength(0);
  });

  it('removes the css display property', () => {
    const element = document.createElement('div');
    element.style.display = 'none';

    show(element);

    expect(element.style.display).toEqual('');
  });
});

describe('hide', () => {
  it('removes the css display property', () => {
    const element = document.createElement('div');

    hide(element);

    expect(element.style.display).toEqual('none');
  });
});

describe('toHumanDate', () => {
  beforeAll(() => {
    Date.prototype.getFullYear = jest.fn().mockReturnValue(2018);
  });

  it('formats a date in the past', () => {
    const date = {
      year: jest.fn().mockReturnValue(2017),
      format: jest.fn().mockReturnValue('7/1/17'),
    };

    expect(toHumanDate(date)).toEqual('7/1/17');
    expect(date.format).toBeCalledWith('M/D/YY');
  });

  it('formats a date in the current year', () => {
    const date = {
      year: jest.fn().mockReturnValue(2018),
      format: jest.fn().mockReturnValue('7/1'),
    };

    expect(toHumanDate(date)).toEqual('7/1');
    expect(date.format).toBeCalledWith('M/D');
  });

  it('formats a date in the future', () => {
    const date = {
      year: jest.fn().mockReturnValue(2019),
      format: jest.fn().mockReturnValue('7/1/19'),
    };

    expect(toHumanDate(date)).toEqual('7/1/19');
    expect(date.format).toBeCalledWith('M/D/YY');
  });

  it('formats a date with the time', () => {
    const date = {
      year: jest.fn().mockReturnValue(2019),
      format: jest.fn().mockReturnValue('7/1/19 8:30 AM'),
    };

    expect(toHumanDate(date, true)).toEqual('7/1/19 8:30 AM');
    expect(date.format).toBeCalledWith('M/D/YY h:mm A');
  });
});