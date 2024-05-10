import formDataBuilder from '../form-data-builder';

function rawDataFor(formData: FormData) {
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

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
});
