import {
  compact,
  first,
  last,
  remove,
  toSentence,
} from '../src/js/array';

describe('compact', () => {
  it('compacts null and undefined', () => {
    expect(compact([1, null, 2, 3, undefined])).toEqual([1, 2, 3]);
    expect(compact([null, undefined, null])).toEqual([]);
  });

  it('compacts empty strings', () => {
    expect(compact([1, null, 2, 3, undefined, '', '4'])).toEqual([1, 2, 3, '4']);
    expect(compact([null, '', undefined, null, ''])).toEqual([]);
  });

  it('does not compact empty strings', () => {
    expect(compact([1, null, 2, 3, undefined, '', '4'], false)).toEqual([1, 2, 3, '', '4']);
    expect(compact([null, '', undefined, null, ''], false)).toEqual(['', '']);
  });
});

describe('first', () => {
  it('returns the first element', () => {
    expect(first([1, 2, 3])).toEqual(1);
    expect(first([])).toBeUndefined();
  });
});

describe('last', () => {
  it('returns the last element', () => {
    expect(last([1, 2, 3])).toEqual(3);
    expect(last([])).toBeUndefined();
  });
});

describe('remove', () => {
  it('removes an element from an array', () => {
    const arr = [1, 2, 3];

    remove(arr, 3);

    expect(arr).toEqual([1, 2]);

    remove(arr, 4);

    expect(arr).toEqual([1, 2]);
  });
});

describe('toSentence', () => {
  it('joins words and stuff', () => {
    expect(toSentence([1, 2, 3])).toEqual('1, 2, and 3');
    expect(toSentence([1, 2])).toEqual('1 and 2');
    expect(toSentence([1])).toEqual('1');
    expect(toSentence([])).toEqual('');
  });
});
