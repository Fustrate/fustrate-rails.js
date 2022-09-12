import {
  humanize,
  isBlank,
  isPresent,
  parameterize,
  phoneFormat,
  pluralize,
  presence,
  underscore,
} from '../src/string';

require('../src/polyfills');

describe('#humanize()', () => {
  it('dasherizes a string', () => {
    expect(humanize('helloWorld_test')).toBe('hello world test');
  });
});

describe('#isBlank()', () => {
  it('dasherizes a string', () => {
    expect(isBlank('')).toBe(true);
    expect(isBlank(' \t\n ')).toBe(true);
    expect(isBlank(null)).toBe(true);
    expect(isBlank(undefined)).toBe(true);

    expect(isBlank('a')).toBe(false);
    expect(isBlank(' \ta\n ')).toBe(false);
  });
});

describe('#isPresent()', () => {
  it('dasherizes a string', () => {
    expect(isPresent('')).toBe(false);
    expect(isPresent(' \t\n ')).toBe(false);
    expect(isPresent(null)).toBe(false);
    expect(isPresent(undefined)).toBe(false);

    expect(isPresent('a')).toBe(true);
    expect(isPresent(' \ta\n ')).toBe(true);
  });
});

describe('#parameterize()', () => {
  it('parameterizes a string', () => {
    expect(parameterize('helloWorld')).toBe('hello_world');
    expect(parameterize(',,a')).toBe('a');
    expect(parameterize('b,,')).toBe('b');
    expect(parameterize('a,,,b')).toBe('a-b');
  });
});

describe('#phoneFormat()', () => {
  it('formats a phone number', () => {
    expect(phoneFormat('6618675309')).toBe('(661) 867-5309');
    expect(phoneFormat('8675309')).toBe('867-5309');
    expect(phoneFormat('411')).toBe('411');
    expect(phoneFormat('07734')).toBe('07734');
  });
});

describe('#pluralize()', () => {
  it('pluralizes a string', () => {
    expect(pluralize('library')).toBe('libraries');
    expect(pluralize('squirrel')).toBe('squirrels');
    // expect(pluralize("goose")).toBe("geese");
    // expect(pluralize("ox")).toBe("oxen");
  });
});

describe('#presence()', () => {
  it('checks the presence of a string', () => {
    expect(presence('hello world')).toBe('hello world');

    expect(presence('')).toBeUndefined();
    expect(presence(null)).toBeUndefined();
    expect(presence(undefined)).toBeUndefined();
  });
});

describe('#underscore()', () => {
  it('underscores a string', () => {
    expect(underscore('Subreddit::Sidebar')).toBe('subreddit/sidebar');
    expect(underscore('helloWorld')).toBe('hello_world');
  });
});
