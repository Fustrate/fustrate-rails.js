import assert from 'assert';

import { deepExtend, isPlainObject } from '../src/js/object';
import BasicObject from '../src/js/basic_object';

describe('#deepExtend()', () => {
  it('extends an object deeply', () => {
    assert.deepStrictEqual(
      deepExtend({}, { a: { b: { c: [1, 2, 3] } } }, { a: { b: { d: 4 } } }, { e: 5 }),
      { a: { b: { c: [1, 2, 3], d: 4 } }, e: 5 },
    );
  });
});

describe('#isPlainObject()', () => {
  it('null is not a plain object', () => {
    assert(!isPlainObject(null));
  });

  it('an array is not a plain object', () => {
    assert(!isPlainObject([]));
    assert(!isPlainObject([1, 2, 3]));
  });

  it('undefined is not a plain object', () => {
    assert(!isPlainObject(undefined));
  });

  it('{} is a plain object', () => {
    assert(isPlainObject({}));
    assert(isPlainObject({ abc: 123, def: 456 }));
  });

  it('new Object() is a plain object', () => {
    // eslint-disable-next-line no-new-object
    assert(isPlainObject(new Object()));
  });

  it('BasicObject is not a plain object', () => {
    class Thing extends BasicObject {
    }

    assert(!isPlainObject(new Thing(false)));
  });
});
