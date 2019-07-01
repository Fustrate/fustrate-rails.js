import assert from 'assert';
import {
  compact, first, last, remove, toSentence,
} from '../src/js/array';

describe('compact', () => {
  it('compacts null and undefined', () => {
    assert.deepStrictEqual(compact([1, null, 2, 3, undefined]), [1, 2, 3]);
    assert.deepStrictEqual(compact([null, undefined, null]), []);
  });

  it('compacts empty strings', () => {
    assert.deepStrictEqual(compact([1, null, 2, 3, undefined, '', '4']), [1, 2, 3, '4']);
    assert.deepStrictEqual(compact([null, '', undefined, null, '']), []);
  });

  it('does not compact empty strings', () => {
    assert.deepStrictEqual(compact([1, null, 2, 3, undefined, '', '4'], false), [1, 2, 3, '', '4']);
    assert.deepStrictEqual(compact([null, '', undefined, null, ''], false), ['', '']);
  });
});

describe('first', () => {
  it('returns the first element', () => {
    assert.strictEqual(first([1, 2, 3]), 1);
    assert.strictEqual(first([]), undefined);
  });
});

describe('last', () => {
  it('returns the last element', () => {
    assert.strictEqual(last([1, 2, 3]), 3);
    assert.strictEqual(last([]), undefined);
  });
});

describe('remove', () => {
  it('removes an element from an array', () => {
    const arr = [1, 2, 3];

    remove(arr, 3);

    assert.deepStrictEqual(arr, [1, 2]);

    remove(arr, 4);

    assert.deepStrictEqual(arr, [1, 2]);
  });
});

describe('toSentence', () => {
  it('joins words and stuff', () => {
    assert.strictEqual(toSentence([1, 2, 3]), '1, 2, and 3');
    assert.strictEqual(toSentence([1, 2]), '1 and 2');
    assert.strictEqual(toSentence([1]), '1');
    assert.strictEqual(toSentence([]), '');
  });
});
