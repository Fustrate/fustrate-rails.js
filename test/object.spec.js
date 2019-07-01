import { deepExtend, isPlainObject } from '../src/js/object';
import BasicObject from '../src/js/basic_object';

describe('#deepExtend()', () => {
  it('extends an object deeply', () => {
    expect(
      deepExtend({}, { a: { b: { c: [1, 2, 3] } } }, { a: { b: { d: 4 } } }, { e: 5 }),
    ).toEqual({ a: { b: { c: [1, 2, 3], d: 4 } }, e: 5 });
  });
});

describe('#isPlainObject()', () => {
  it('null is not a plain object', () => {
    expect(isPlainObject(null)).toBeFalsy();
  });

  it('an array is not a plain object', () => {
    expect(isPlainObject([])).toBeFalsy();
    expect(isPlainObject([1, 2, 3])).toBeFalsy();
  });

  it('undefined is not a plain object', () => {
    expect(isPlainObject(undefined)).toBeFalsy();
  });

  it('{} is a plain object', () => {
    expect(isPlainObject({})).toBeTruthy();
    expect(isPlainObject({ abc: 123, def: 456 })).toBeTruthy();
  });

  it('new Object() is a plain object', () => {
    // eslint-disable-next-line no-new-object
    expect(isPlainObject(new Object())).toBeTruthy();
  });

  it('BasicObject is not a plain object', () => {
    class Thing extends BasicObject {}

    expect(isPlainObject(new Thing(false))).toBeFalsy();
  });
});
