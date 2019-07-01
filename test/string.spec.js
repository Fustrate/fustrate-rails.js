import assert from 'assert';
import {
  capitalize, dasherize, humanize, isBlank, isPresent, parameterize, phoneFormat, pluralize,
  presence, strip, titleize, underscore,
} from '../src/js/string';

describe('#capitalize()', () => {
  it('capitalizes a string', () => {
    assert.strictEqual(capitalize('hello world'), 'Hello world');
    assert.strictEqual(capitalize('HELLO WORLD'), 'HELLO WORLD');
  });
});

describe('#dasherize()', () => {
  it('dasherizes a string', () => {
    assert.strictEqual(dasherize('hello_world'), 'hello-world');
  });
});

describe('#humanize()', () => {
  it('dasherizes a string', () => {
    assert.strictEqual(humanize('helloWorld_test'), 'hello world test');
  });
});

describe('#isBlank()', () => {
  it('dasherizes a string', () => {
    assert(isBlank(''));
    assert(isBlank(' \t\n '));
    assert(isBlank(null));
    assert(isBlank(undefined));

    assert(!isBlank('a'));
    assert(!isBlank(' \ta\n '));
  });
});

describe('#isPresent()', () => {
  it('dasherizes a string', () => {
    assert(!isPresent(''));
    assert(!isPresent(' \t\n '));
    assert(!isPresent(null));
    assert(!isPresent(undefined));

    assert(isPresent('a'));
    assert(isPresent(' \ta\n '));
  });
});

describe('#parameterize()', () => {
  it('parameterizes a string', () => {
    assert.strictEqual(parameterize('helloWorld'), 'hello_world');
    assert.strictEqual(parameterize(',,a'), 'a');
    assert.strictEqual(parameterize('b,,'), 'b');
    assert.strictEqual(parameterize('a,,,b'), 'a-b');
  });
});

describe('#phoneFormat()', () => {
  it('formats a phone number', () => {
    assert.strictEqual(phoneFormat('6618675309'), '(661) 867-5309');
    assert.strictEqual(phoneFormat('8675309'), '867-5309');
    assert.strictEqual(phoneFormat('411'), '411');
    assert.strictEqual(phoneFormat('07734'), '07734');
  });
});

describe('#pluralize()', () => {
  it('pluralizes a string', () => {
    assert.strictEqual(pluralize('library'), 'libraries');
    assert.strictEqual(pluralize('squirrel'), 'squirrels');
    // assert.strictEqual(pluralize("goose"), "geese");
    // assert.strictEqual(pluralize("ox"), "oxen");
  });
});

describe('#presence()', () => {
  it('checks the presence of a string', () => {
    assert.strictEqual(presence('hello world'), 'hello world');

    assert.strictEqual(presence(''), undefined);
    assert.strictEqual(presence(null), undefined);
    assert.strictEqual(presence(undefined), undefined);
  });
});

describe('#strip()', () => {
  it('strips a string', () => {
    assert.strictEqual(strip('hello world'), 'hello world');
    assert.strictEqual(strip('   hello world'), 'hello world');
    assert.strictEqual(strip('\thello world '), 'hello world');
    assert.strictEqual(strip('hello world\t'), 'hello world');
    assert.strictEqual(strip('\nhello\nworld'), 'hello\nworld');
  });
});

describe('#titleize()', () => {
  it('titleizes a string', () => {
    assert.strictEqual(titleize('hello world'), 'Hello World');
    assert.strictEqual(titleize('hello_world'), 'Hello World');
    // assert.strictEqual(titleize('it's a surprise'), "It's A Surprise");
  });
});

describe('#underscore()', () => {
  it('underscores a string', () => {
    assert.strictEqual(underscore('Subreddit::Sidebar'), 'subreddit/sidebar');
    assert.strictEqual(underscore('helloWorld'), 'hello_world');
  });
});
