import { toSentence } from '../src/js/array';

describe('toSentence', () => {
  it('joins words and stuff', () => {
    expect(toSentence([1, 2, 3])).toEqual('1, 2, and 3');
    expect(toSentence([1, 2])).toEqual('1 and 2');
    expect(toSentence([1])).toEqual('1');
    expect(toSentence([])).toEqual('');
  });
});
