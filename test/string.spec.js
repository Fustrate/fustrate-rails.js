import {
  humanize,
  isBlank,
  isPresent,
  parameterize,
  phoneFormat,
  pluralize,
  presence,
  underscore,
} from '../src/js/string';

describe('#humanize()', () => {
  it('dasherizes a string', () => {
    expect(humanize('helloWorld_test')).toEqual('hello world test');
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
    expect(parameterize('helloWorld')).toEqual('hello_world');
    expect(parameterize(',,a')).toEqual('a');
    expect(parameterize('b,,')).toEqual('b');
    expect(parameterize('a,,,b')).toEqual('a-b');
  });
});

describe('#phoneFormat()', () => {
  it('formats a phone number', () => {
    expect(phoneFormat('6618675309')).toEqual('(661) 867-5309');
    expect(phoneFormat('8675309')).toEqual('867-5309');
    expect(phoneFormat('411')).toEqual('411');
    expect(phoneFormat('07734')).toEqual('07734');
  });
});

describe('#pluralize()', () => {
  it('pluralizes a string', () => {
    expect(pluralize('library')).toEqual('libraries');
    expect(pluralize('squirrel')).toEqual('squirrels');
    // expect(pluralize("goose")).toEqual("geese");
    // expect(pluralize("ox")).toEqual("oxen");
  });
});

describe('#presence()', () => {
  it('checks the presence of a string', () => {
    expect(presence('hello world')).toEqual('hello world');

    expect(presence('')).toBeUndefined();
    expect(presence(null)).toBeUndefined();
    expect(presence(undefined)).toBeUndefined();
  });
});

describe('#underscore()', () => {
  it('underscores a string', () => {
    expect(underscore('Subreddit::Sidebar')).toEqual('subreddit/sidebar');
    expect(underscore('helloWorld')).toEqual('hello_world');
  });
});
