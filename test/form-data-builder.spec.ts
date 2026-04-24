import formDataBuilder from '../form-data-builder';
import { describe, it, expect } from 'bun:test';

function rawDataFor(formData: FormData) {
  const data = {};

  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  return data;
}

describe('#toFormData', () => {
  it('converts basic values to strings', () => {
    const input = { hello: 'world', age: 99, vip: true };
    const output = { hello: 'world', age: '99', vip: '1' };

    expect(rawDataFor(formDataBuilder(input))).toEqual(output);
  });

  it('creates nested keys', () => {
    const input = {
      bills: {
        0: { denomination: 1, face: 'Washington' },
        1: { denomination: 5, face: 'Lincoln' },
        2: { denomination: 10, face: 'Hamilton' },
      },
    };

    const output = {
      'bills[0][denomination]': '1',
      'bills[0][face]': 'Washington',
      'bills[1][denomination]': '5',
      'bills[1][face]': 'Lincoln',
      'bills[2][denomination]': '10',
      'bills[2][face]': 'Hamilton',
    };

    expect(rawDataFor(formDataBuilder(input))).toEqual(output);
  });

  it('starts with a root node', () => {
    const input = {
      0: { denomination: 1, face: 'Washington' },
      1: { denomination: 5, face: 'Lincoln' },
      2: { denomination: 10, face: 'Hamilton' },
    };

    const output = {
      'bills[0][denomination]': '1',
      'bills[0][face]': 'Washington',
      'bills[1][denomination]': '5',
      'bills[1][face]': 'Lincoln',
      'bills[2][denomination]': '10',
      'bills[2][face]': 'Hamilton',
    };

    expect(rawDataFor(formDataBuilder(input, 'bills'))).toEqual(output);
  });

  it('appends arrays of primitive values as repeated keys', () => {
    const formData = formDataBuilder({ tags: ['red', 'blue', 'green'] });

    expect(formData.getAll('tags[]')).toEqual(['red', 'blue', 'green']);
  });

  it('appends arrays of objects with indexed keys', () => {
    const formData = formDataBuilder({ items: [{ name: 'a' }, { name: 'b' }] });

    expect(formData.get('items[0][name]')).toBe('a');
    expect(formData.get('items[1][name]')).toBe('b');
  });

  it('appends blobs directly', () => {
    const blob = new Blob(['content'], { type: 'text/plain' });
    const formData = formDataBuilder({ file: blob });

    expect(formData.get('file')).toBeInstanceOf(Blob);
  });

  it('skips undefined and NaN values', () => {
    const formData = formDataBuilder({ a: undefined, b: NaN });

    expect(formData.has('a')).toBe(false);
    expect(formData.has('b')).toBe(false);
  });

  it('skips null values', () => {
    const formData = formDataBuilder({ a: null });

    expect(formData.has('a')).toBe(false);
  });

  it('converts boolean false to "0"', () => {
    expect(rawDataFor(formDataBuilder({ active: false }))).toEqual({ active: '0' });
  });
});
