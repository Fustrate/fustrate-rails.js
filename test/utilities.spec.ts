import { describe, expect, it } from '@jest/globals';

import {
  animate,
  elementFromString,
  hms,
  icon,
  label,
  linkTo,
  multilineEscapeHTML,
  redirectTo,
  toHumanDate,
} from '../utilities';

describe('animate', () => {
  it('animates for a while', () => {
    const element = document.createElement('div');

    animate(element, 'wacky');

    ['animate__animated', 'animate__wacky'].forEach((classname) => {
      expect(element.classList).toContain(classname);
    });

    element.dispatchEvent(new CustomEvent('animationend'));

    expect(element.classList).toHaveLength(0);
  });

  it('animates with a delay and a speed', () => {
    const element = document.createElement('div');

    animate(element, 'wacky', { delay: 3, speed: 'fast' });

    ['animate__animated', 'animate__wacky', 'animate__delay-3s', 'animate__fast'].forEach((classname) => {
      expect(element.classList).toContain(classname);
    });

    element.dispatchEvent(new CustomEvent('animationend'));

    expect(element.classList).toHaveLength(0);
  });
});

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

describe('hms', () => {
  it('formats zero properly', () => {
    expect(hms(0)).toBe('0:00:00');
    expect(hms(0, '-')).toBe('-');
  });

  it('formats positive numbers', () => {
    expect(hms(1)).toBe('0:00:01');
    expect(hms(61)).toBe('0:01:01');
    expect(hms(5025)).toBe('1:23:45');
    expect(hms(86_400)).toBe('24:00:00');
  });

  it('formats negative numbers', () => {
    expect(hms(-1)).toBe('-0:00:01');
    expect(hms(-61)).toBe('-0:01:01');
    expect(hms(-5025)).toBe('-1:23:45');
    expect(hms(-86_400)).toBe('-24:00:00');
  });
});

describe('icon', () => {
  it('creates a basic icon', () => {
    expect(icon('pencil-alt')).toBe('<i class="fa fa-pencil-alt"></i>');
  });

  it('creates an icon with a different style', () => {
    expect(icon('pencil-alt', 'thin')).toBe('<i class="fa-thin fa-pencil-alt"></i>');
  });

  it('creates an icon with multiple classes', () => {
    expect(icon('pencil-alt 2x')).toBe('<i class="fa fa-pencil-alt fa-2x"></i>');
  });
});

describe('label', () => {
  it('creates a basic label', () => {
    expect(label('Open', 'work-order')).toBe('<span class="label work-order">Open</span>');
    expect(label('Open', 'Open')).toBe('<span class="label open">Open</span>');
  });

  it('creates a label with no type', () => {
    expect(label('Open')).toBe('<span class="label">Open</span>');
  });

  it('creates a label with spaces in the classes', () => {
    expect(label('Work Order', 'work order')).toBe('<span class="label work-order">Work Order</span>');
  });

  it('converts underscores to dashes', () => {
    expect(label('Work Order', 'work_order')).toBe('<span class="label work-order">Work Order</span>');
  });
});

describe('multilineEscapeHTML', () => {
  it('escapes null and undefined', () => {
    expect(multilineEscapeHTML(null)).toBe('');
    expect(multilineEscapeHTML(undefined)).toBe('');
  });

  it('turns newlines into br elements', () => {
    expect(multilineEscapeHTML('The\r\nLos\nAngeles\nDodgers')).toBe(
      'The<br />Los<br />Angeles<br />Dodgers',
    );
  });

  it('escapes entities in a string', () => {
    expect(multilineEscapeHTML('<strong>\'Bob\' `&` "Bill"</strong>\n=/')).toBe(
      '&lt;strong&gt;&#39;Bob&#39; `&amp;` &quot;Bill&quot;&lt;/strong&gt;<br />=/',
    );
  });
});

describe('linkTo', () => {
  it('creates a link to undefined/null', () => {
    expect(linkTo('test')).toBe('<a href="#">test</a>');
    expect(linkTo('test', undefined)).toBe('<a href="#">test</a>');
  });

  it('creates a link to a string href', () => {
    expect(linkTo('test', '')).toBe('<a href="#">test</a>');
    expect(linkTo('test', '/users')).toBe('<a href="/users">test</a>');
  });

  it('creates a link to an object that responds to #path', () => {
    expect(linkTo('test', { path: () => '/users' })).toBe('<a href="/users">test</a>');
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
    expect(linkTo('test', '#', { 'data-label': 'Test', class: 'antelope' })).toBe(
      '<a href="#" data-label="Test" class="antelope">test</a>',
    );
  });
});

describe('redirectTo', () => {
  jest.useFakeTimers();

  Object.defineProperty(window, 'location', {
    value: { href: 'https://github.com' },
    writable: true,
  });

  it('redirects after 750ms', () => {
    redirectTo('https://google.com');

    expect(window.location.href).toBe('https://github.com');

    // Wait for 749ms
    jest.advanceTimersByTime(749);
    expect(window.location.href).toBe('https://github.com');

    // 1 more ms and it should run
    jest.advanceTimersByTime(1);
    expect(window.location.href).toBe('https://google.com');
  });
});

describe('toHumanDate', () => {
  beforeAll(() => {
    Date.prototype.getFullYear = jest.fn().mockReturnValue(2018);
  });

  it('formats a date in the past', () => {
    const date = {
      year: 2017,
      toFormat: jest.fn().mockReturnValue('7/1/17'),
    };

    expect(toHumanDate(date)).toBe('7/1/17');
    expect(date.toFormat).toBeCalledWith('M/d/yy');
  });

  it('formats a date in the current year', () => {
    const date = {
      year: 2018,
      toFormat: jest.fn().mockReturnValue('7/1'),
    };

    expect(toHumanDate(date)).toBe('7/1');
    expect(date.toFormat).toBeCalledWith('M/d');
  });

  it('formats a date in the future', () => {
    const date = {
      year: 2019,
      toFormat: jest.fn().mockReturnValue('7/1/19'),
    };

    expect(toHumanDate(date)).toBe('7/1/19');
    expect(date.toFormat).toBeCalledWith('M/d/yy');
  });

  it('formats a date with the time', () => {
    const date = {
      year: 2019,
      toFormat: jest.fn().mockReturnValue('7/1/19 8:30 AM'),
    };

    expect(toHumanDate(date, true)).toBe('7/1/19 8:30 AM');
    expect(date.toFormat).toBeCalledWith('M/d/yy t');
  });
});
