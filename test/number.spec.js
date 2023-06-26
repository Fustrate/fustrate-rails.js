import {
  accountingFormat,
  bytesToString,
  ordinalize,
  truncate,
} from '../number';

describe('#accountingFormat()', () => {
  it('should format a positive integer', () => {
    expect(accountingFormat(50)).toBe('$50.00');
  });

  it('should format a negative integer', () => {
    expect(accountingFormat(-50)).toBe('($50.00)');
  });

  it('should format a positive float', () => {
    expect(accountingFormat(50.75)).toBe('$50.75');
  });

  it('should format a negative float', () => {
    expect(accountingFormat(-50.75)).toBe('($50.75)');
  });

  it('should format a float with extra digits', () => {
    expect(accountingFormat(50.753)).toBe('$50.75');
  });

  it('should format zero', () => {
    expect(accountingFormat(0)).toBe('$0.00');
  });
});

describe('#bytesToString()', () => {
  it('shows bytes', () => {
    expect(bytesToString(0)).toBe('0 B');
    expect(bytesToString(999)).toBe('999 B');
  });

  it('shows kilobytes', () => {
    expect(bytesToString(1000)).toBe('1 kB');
    expect(bytesToString(999999)).toBe('1000 kB');
  });

  it('shows megabytes', () => {
    expect(bytesToString(1000000)).toBe('1 MB');
    expect(bytesToString(999999999)).toBe('1000 MB');
  });

  it('shows gigabytes', () => {
    expect(bytesToString(1000000000)).toBe('1 GB');
    expect(bytesToString(999999999999)).toBe('1000 GB');
  });
});

describe('#ordinalize()', () => {
  it('ordinalizes 1st, 21st, 31st, 101st', () => {
    expect(ordinalize(1)).toBe('1st');
    expect(ordinalize(21)).toBe('21st');
    expect(ordinalize(31)).toBe('31st');
    expect(ordinalize(101)).toBe('101st');
  });

  it('ordinalizes 2nd, 22nd, 32nd, 102nd', () => {
    expect(ordinalize(2)).toBe('2nd');
    expect(ordinalize(22)).toBe('22nd');
    expect(ordinalize(32)).toBe('32nd');
    expect(ordinalize(102)).toBe('102nd');
  });

  it('ordinalizes 3rd, 23rd, 33rd, 103rd', () => {
    expect(ordinalize(3)).toBe('3rd');
    expect(ordinalize(23)).toBe('23rd');
    expect(ordinalize(33)).toBe('33rd');
    expect(ordinalize(103)).toBe('103rd');
  });

  it('ordinalizes 4th, 5th, 6th, 7th, 8th, 9th, 10th, 11th, 12th, 13th', () => {
    expect(ordinalize(4)).toBe('4th');
    expect(ordinalize(5)).toBe('5th');
    expect(ordinalize(6)).toBe('6th');
    expect(ordinalize(7)).toBe('7th');
    expect(ordinalize(8)).toBe('8th');
    expect(ordinalize(9)).toBe('9th');
    expect(ordinalize(10)).toBe('10th');
    expect(ordinalize(11)).toBe('11th');
    expect(ordinalize(12)).toBe('12th');
    expect(ordinalize(13)).toBe('13th');
  });

  it('ordinalizes 20th, 30th, 100th', () => {
    expect(ordinalize(20)).toBe('20th');
    expect(ordinalize(30)).toBe('30th');
    expect(ordinalize(100)).toBe('100th');
  });
});

describe('#truncate()', () => {
  it('defaults to 2 digits', () => {
    expect(truncate(1.2345)).toBe('1.23');
  });

  it('can truncate to 0 digits', () => {
    expect(truncate(1.2345, 0)).toBe('1');
  });

  it('removes trailing zeros', () => {
    expect(truncate(1.234, 5)).toBe('1.234');
  });

  it('removes trailing zeros on a whole number', () => {
    expect(truncate(1, 5)).toBe('1');
  });

  it('truncates (999999 / 1000) to 1000', () => {
    expect(truncate(999999 / 1000)).toBe('1000');
  });
});
