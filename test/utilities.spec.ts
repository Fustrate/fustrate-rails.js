import { animate, hms, icon, label, linkTo, toHumanDate } from '../utilities';

describe('animate', () => {
  it('animates for a while', () => {
    const element = document.createElement('div');

    animate(element, 'wacky');

    for (const classname of ['animate__animated', 'animate__wacky']) {
      expect(element.classList).toContain(classname);
    }

    element.dispatchEvent(new CustomEvent('animationend'));

    expect(element.classList).toHaveLength(0);
  });

  it('animates with a delay and a speed', () => {
    const element = document.createElement('div');

    animate(element, 'wacky', { delay: 3, speed: 'fast' });

    for (const classname of ['animate__animated', 'animate__wacky', 'animate__delay-3s', 'animate__fast']) {
      expect(element.classList).toContain(classname);
    }

    element.dispatchEvent(new CustomEvent('animationend'));

    expect(element.classList).toHaveLength(0);
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

describe('linkTo', () => {
  it('creates a link to undefined/null', () => {
    expect(linkTo('test', null)).toBe('<a href="#">test</a>');
    expect(linkTo('test', void 0)).toBe('<a href="#">test</a>');
  });

  it('creates a link to a string href', () => {
    expect(linkTo('test', '')).toBe('<a href="#">test</a>');
    expect(linkTo('test', '/users')).toBe('<a href="/users">test</a>');
  });

  it('creates a link to an object that responds to #path', () => {
    expect(linkTo('test', { path: () => '/users' })).toBe('<a href="/users">test</a>');
  });

  it('creates a link with extra attributes', () => {
    expect(linkTo('test', '#', { 'data-label': 'Test', class: 'antelope' })).toBe(
      '<a href="#" data-label="Test" class="antelope">test</a>',
    );
  });
});

describe('toHumanDate', () => {
  beforeAll(() => {
    // eslint-disable-next-line no-extend-native
    Date.prototype.getFullYear = jest.fn().mockReturnValue(2018);
  });

  it('formats a date in the past', () => {
    const date = {
      year: 2017,
      toFormat: jest.fn().mockReturnValue('7/1/17'),
    };

    expect(toHumanDate(date)).toBe('7/1/17');
    expect(date.toFormat).toHaveBeenCalledWith('M/d/yy');
  });

  it('formats a date in the current year', () => {
    const date = {
      year: 2018,
      toFormat: jest.fn().mockReturnValue('7/1'),
    };

    expect(toHumanDate(date)).toBe('7/1');
    expect(date.toFormat).toHaveBeenCalledWith('M/d');
  });

  it('formats a date in the future', () => {
    const date = {
      year: 2019,
      toFormat: jest.fn().mockReturnValue('7/1/19'),
    };

    expect(toHumanDate(date)).toBe('7/1/19');
    expect(date.toFormat).toHaveBeenCalledWith('M/d/yy');
  });

  it('formats a date with the time', () => {
    const date = {
      year: 2019,
      toFormat: jest.fn().mockReturnValue('7/1/19 8:30 AM'),
    };

    expect(toHumanDate(date, true)).toBe('7/1/19 8:30 AM');
    expect(date.toFormat).toHaveBeenCalledWith('M/d/yy t');
  });
});
