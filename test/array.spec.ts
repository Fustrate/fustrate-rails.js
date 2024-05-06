import { toSentence } from '../array';

describe('toSentence', () => {
  it('joins words and stuff', () => {
    expect(toSentence(['1', '2', '3'])).toBe('1, 2, and 3');
    expect(toSentence(['1', '2'])).toBe('1 and 2');
    expect(toSentence(['1'])).toBe('1');
    expect(toSentence([])).toBe('');
  });
});
