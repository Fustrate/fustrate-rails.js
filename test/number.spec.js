import { accountingFormat, bytesToString, ordinalize, truncate } from '../src/js/number';

describe('#accountingFormat()', () => {
  it('should format a positive integer', () => {
    expect(accountingFormat(50)).toEqual('$50.00');
  });

  it('should format a negative integer', () => {
    expect(accountingFormat(-50)).toEqual('($50.00)');
  });

  it('should format a positive float', () => {
    expect(accountingFormat(50.75)).toEqual('$50.75');
  });

  it('should format a negative float', () => {
    expect(accountingFormat(-50.75)).toEqual('($50.75)');
  });

  it('should format a float with extra digits', () => {
    expect(accountingFormat(50.753)).toEqual('$50.75');
  });

  it('should format zero', () => {
    expect(accountingFormat(0)).toEqual('$0.00');
  });
});

describe('#bytesToString()', () => {
  it('shows bytes', () => {
    expect(bytesToString(0)).toEqual('0 B');
    expect(bytesToString(999)).toEqual('999 B');
  });

  it('shows kilobytes', () => {
    expect(bytesToString(1000)).toEqual('1 kB');
    expect(bytesToString(999999)).toEqual('1000 kB');
  });

  it('shows megabytes', () => {
    expect(bytesToString(1000000)).toEqual('1 MB');
    expect(bytesToString(999999999)).toEqual('1000 MB');
  });

  it('shows gigabytes', () => {
    expect(bytesToString(1000000000)).toEqual('1 GB');
    expect(bytesToString(999999999999)).toEqual('1000 GB');
  });
});

describe('#ordinalize()', () => {
  it('ordinalizes 1st, 21st, 31st, 101st', () => {
    expect(ordinalize(1)).toEqual('1st');
    expect(ordinalize(21)).toEqual('21st');
    expect(ordinalize(31)).toEqual('31st');
    expect(ordinalize(101)).toEqual('101st');
  });

  it('ordinalizes 2nd, 22nd, 32nd, 102nd', () => {
    expect(ordinalize(2)).toEqual('2nd');
    expect(ordinalize(22)).toEqual('22nd');
    expect(ordinalize(32)).toEqual('32nd');
    expect(ordinalize(102)).toEqual('102nd');
  });

  it('ordinalizes 3rd, 23rd, 33rd, 103rd', () => {
    expect(ordinalize(3)).toEqual('3rd');
    expect(ordinalize(23)).toEqual('23rd');
    expect(ordinalize(33)).toEqual('33rd');
    expect(ordinalize(103)).toEqual('103rd');
  });

  it('ordinalizes 4th, 5th, 6th, 7th, 8th, 9th, 10th, 11th, 12th, 13th', () => {
    expect(ordinalize(4)).toEqual('4th');
    expect(ordinalize(5)).toEqual('5th');
    expect(ordinalize(6)).toEqual('6th');
    expect(ordinalize(7)).toEqual('7th');
    expect(ordinalize(8)).toEqual('8th');
    expect(ordinalize(9)).toEqual('9th');
    expect(ordinalize(10)).toEqual('10th');
    expect(ordinalize(11)).toEqual('11th');
    expect(ordinalize(12)).toEqual('12th');
    expect(ordinalize(13)).toEqual('13th');
  });

  it('ordinalizes 20th, 30th, 100th', () => {
    expect(ordinalize(20)).toEqual('20th');
    expect(ordinalize(30)).toEqual('30th');
    expect(ordinalize(100)).toEqual('100th');
  });
});

describe('#truncate()', () => {
  it('defaults to 2 digits', () => {
    expect(truncate(1.2345)).toEqual('1.23');
  });

  it('can truncate to 0 digits', () => {
    expect(truncate(1.2345, 0)).toEqual('1');
  });

  it('removes trailing zeros', () => {
    expect(truncate(1.234, 5)).toEqual('1.234');
  });

  it('removes trailing zeros on a whole number', () => {
    expect(truncate(1, 5)).toEqual('1');
  });

  it('truncates (999999 / 1000) to 1000', () => {
    expect(truncate(999999 / 1000)).toEqual('1000');
  });
});
