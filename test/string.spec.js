import {
  capitalize,
  dasherize,
  humanize,
  isBlank,
  isPresent,
  parameterize,
  phoneFormat,
  pluralize,
  presence,
  strip,
  titleize,
  underscore,
} from '../src/js/string';

describe('#capitalize()', () => {
  it('capitalizes a string', () => {
    expect(capitalize('hello world')).toEqual('Hello world');
    expect(capitalize('HELLO WORLD')).toEqual('HELLO WORLD');
  });
});

describe('#dasherize()', () => {
  it('dasherizes a string', () => {
    expect(dasherize('hello_world')).toEqual('hello-world');
  });
});

describe('#humanize()', () => {
  it('dasherizes a string', () => {
    expect(humanize('helloWorld_test')).toEqual('hello world test');
  });
});

describe('#isBlank()', () => {
  it('dasherizes a string', () => {
    expect(isBlank('')).toBeTruthy();
    expect(isBlank(' \t\n ')).toBeTruthy();
    expect(isBlank(null)).toBeTruthy();
    expect(isBlank(undefined)).toBeTruthy();

    expect(isBlank('a')).toBeFalsy();
    expect(isBlank(' \ta\n ')).toBeFalsy();
  });
});

describe('#isPresent()', () => {
  it('dasherizes a string', () => {
    expect(isPresent('')).toBeFalsy();
    expect(isPresent(' \t\n ')).toBeFalsy();
    expect(isPresent(null)).toBeFalsy();
    expect(isPresent(undefined)).toBeFalsy();

    expect(isPresent('a')).toBeTruthy();
    expect(isPresent(' \ta\n ')).toBeTruthy();
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

describe('#strip()', () => {
  it('strips a string', () => {
    expect(strip('hello world')).toEqual('hello world');
    expect(strip('   hello world')).toEqual('hello world');
    expect(strip('\thello world ')).toEqual('hello world');
    expect(strip('hello world\t')).toEqual('hello world');
    expect(strip('\nhello\nworld')).toEqual('hello\nworld');
  });
});

describe('#titleize()', () => {
  it('titleizes a string', () => {
    expect(titleize('hello world')).toEqual('Hello World');
    expect(titleize('hello_world')).toEqual('Hello World');
    // expect(titleize('it's a surprise')).toEqual("It's A Surprise");
  });
});

describe('#underscore()', () => {
  it('underscores a string', () => {
    expect(underscore('Subreddit::Sidebar')).toEqual('subreddit/sidebar');
    expect(underscore('helloWorld')).toEqual('hello_world');
  });
});
