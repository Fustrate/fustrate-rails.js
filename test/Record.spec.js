import Record from '../src/js/record';

describe('constructor', () => {
  it('constructs a Record without an ID', () => {
    expect(new Record().id).toBeUndefined();
  });

  it('constructs a Record with an ID', () => {
    expect(new Record(5).id).toBe(5);
    expect(new Record('5').id).toBe(5);
  });

  it('constructors a Record with attributes', () => {
    const mockedExtraction = jest.fn();

    Record.prototype.extractFromData = mockedExtraction;

    const data = { id: 5, name: 'Steven' };

    new Record(data); // eslint-disable-line no-new

    expect(mockedExtraction).toBeCalledWith(data);
  });
});

describe('#reload', () => {});

describe('#extractFromData', () => {});

describe('#update', () => {});

describe('#delete', () => {});

describe('.paramKey', () => {});

describe('.create', () => {});
