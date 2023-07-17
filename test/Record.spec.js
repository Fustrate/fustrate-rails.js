import Record from '../record';

describe('constructor', () => {
  it('constructs a Record without an ID', () => {
    expect(new Record().id).toBeUndefined();
  });

  it('constructs a Record with an ID', () => {
    expect(new Record(5).id).toBe(5);
    expect(new Record('5').id).toBe(5);
  });
});

describe('#reload', () => { });

describe('#extractFromData', () => {
  it('extracts attributes for a record', () => {
    const record = new Record();

    const data = { id: 5, name: 'Steven' };

    record.extractFromData(data);

    expect(record.id).toBe(5);
    expect(record.name).toBe('Steven');
  });
});

describe('#update', () => { });

describe('#delete', () => { });

describe('#create', () => { });
