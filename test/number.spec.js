import assert from 'assert';
import {
  accountingFormat, bytesToString, ordinalize, truncate,
} from '../src/js/number';

describe('#accountingFormat()', () => {
  it('should format a positive integer', () => {
    assert.strictEqual(accountingFormat(50), '$50.00');
  });

  it('should format a negative integer', () => {
    assert.strictEqual(accountingFormat(-50), '($50.00)');
  });

  it('should format a positive float', () => {
    assert.strictEqual(accountingFormat(50.75), '$50.75');
  });

  it('should format a negative float', () => {
    assert.strictEqual(accountingFormat(-50.75), '($50.75)');
  });

  it('should format a float with extra digits', () => {
    assert.strictEqual(accountingFormat(50.753), '$50.75');
  });

  it('should format zero', () => {
    assert.strictEqual(accountingFormat(0), '$0.00');
  });
});

describe('#bytesToString()', () => {
  it('shows bytes', () => {
    assert.equal(bytesToString(0), '0 B');
    assert.equal(bytesToString(999), '999 B');
  });

  it('shows kilobytes', () => {
    assert.equal(bytesToString(1000), '1 kB');
    assert.equal(bytesToString(999999), '1000 kB');
  });

  it('shows megabytes', () => {
    assert.equal(bytesToString(1000000), '1 MB');
    assert.equal(bytesToString(999999999), '1000 MB');
  });

  it('shows gigabytes', () => {
    assert.equal(bytesToString(1000000000), '1 GB');
    assert.equal(bytesToString(999999999999), '1000 GB');
  });
});

describe('#ordinalize()', () => {
  it('ordinalizes 1st, 21st, 31st, 101st', () => {
    assert.equal(ordinalize(1), '1st');
    assert.equal(ordinalize(21), '21st');
    assert.equal(ordinalize(31), '31st');
    assert.equal(ordinalize(101), '101st');
  });

  it('ordinalizes 2nd, 22nd, 32nd, 102nd', () => {
    assert.equal(ordinalize(2), '2nd');
    assert.equal(ordinalize(22), '22nd');
    assert.equal(ordinalize(32), '32nd');
    assert.equal(ordinalize(102), '102nd');
  });

  it('ordinalizes 3rd, 23rd, 33rd, 103rd', () => {
    assert.equal(ordinalize(3), '3rd');
    assert.equal(ordinalize(23), '23rd');
    assert.equal(ordinalize(33), '33rd');
    assert.equal(ordinalize(103), '103rd');
  });

  it('ordinalizes 4th, 5th, 6th, 7th, 8th, 9th, 10th, 11th, 12th, 13th', () => {
    assert.equal(ordinalize(4), '4th');
    assert.equal(ordinalize(5), '5th');
    assert.equal(ordinalize(6), '6th');
    assert.equal(ordinalize(7), '7th');
    assert.equal(ordinalize(8), '8th');
    assert.equal(ordinalize(9), '9th');
    assert.equal(ordinalize(10), '10th');
    assert.equal(ordinalize(11), '11th');
    assert.equal(ordinalize(12), '12th');
    assert.equal(ordinalize(13), '13th');
  });

  it('ordinalizes 20th, 30th, 100th', () => {
    assert.equal(ordinalize(20), '20th');
    assert.equal(ordinalize(30), '30th');
    assert.equal(ordinalize(100), '100th');
  });
});

describe('#truncate()', () => {
  it('defaults to 2 digits', () => {
    assert.equal(truncate(1.2345), '1.23');
  });

  it('can truncate to 0 digits', () => {
    assert.equal(truncate(1.2345, 0), '1');
  });

  it('removes trailing zeros', () => {
    assert.equal(truncate(1.234, 5), '1.234');
  });

  it('removes trailing zeros on a whole number', () => {
    assert.equal(truncate(1, 5), '1');
  });

  it('truncates (999999 / 1000) to 1000', () => {
    assert.equal(truncate(999999 / 1000), '1000');
  });
});
