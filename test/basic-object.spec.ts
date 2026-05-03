import BasicObject from '../basic-object';
import { describe, it, expect } from 'vitest';

class Event extends BasicObject {
  public note: string;
  public eventable: unknown;

  override extractFromData(data?: Record<string, unknown>) {
    if (data == null) {
      return {};
    }

    if (typeof data.note === 'string') {
      this.note = data.note;
    }

    if (data.eventable) {
      this.eventable = data.eventable;
    }

    return data;
  }
}

class TestRecord extends BasicObject {
  public date: Date;
  public events: Event[] = [];
  public parent: unknown;
  public age: number;

  override extractFromData(data?: Record<string, unknown>) {
    if (data == null) {
      return {};
    }

    if (data.date instanceof Date || typeof data.date === 'string' || typeof data.date === 'number') {
      this.date = new Date(data.date);
    }

    if (Array.isArray(data.events)) {
      this.events = Event.buildList(data.events as Array<Record<string, unknown>>, { eventable: this });
    }

    if (data.parent) {
      this.parent = data.parent;
    }

    this.age = Number(data.age);

    return data;
  }
}

class SimpleRecord extends BasicObject {
  public name?: string;
}

describe('::build', () => {
  it('returns null when data is undefined', () => {
    expect(SimpleRecord.build(undefined)).toBeNull();
  });

  it('returns the same instance when data is already an instance of the class', () => {
    const record = new SimpleRecord();

    expect(SimpleRecord.build(record)).toBe(record);
  });

  it('builds from a numeric ID', () => {
    const record = SimpleRecord.build(42) as SimpleRecord & { id: number };

    expect(record).toBeInstanceOf(SimpleRecord);
    expect(record.id).toBe(42);
  });

  it('builds from a string ID', () => {
    const record = SimpleRecord.build('99') as SimpleRecord & { id: string };

    expect(record).toBeInstanceOf(SimpleRecord);
    expect(record.id).toBe('99');
  });

  it('builds from a plain object', () => {
    const record = SimpleRecord.build({ name: 'Alice' }) as SimpleRecord;

    expect(record).toBeInstanceOf(SimpleRecord);
    expect(record?.name).toBe('Alice');
  });

  it('merges extra attributes over the data', () => {
    const record = SimpleRecord.build({ name: 'Alice' }, { name: 'Bob' });

    expect(record?.name).toBe('Bob');
  });
});

describe('::buildList', () => {
  it('builds an array of objects', () => {
    const records = TestRecord.buildList([{ age: 5 }, { age: 10 }, { age: 15 }]);

    expect(records).toHaveLength(3);
    expect(records[0]).toBeInstanceOf(TestRecord);
    expect(records[1].age).toBe(10);
  });

  it('builds an array of objects with extra attributes', () => {
    const parent = new TestRecord();
    const records = TestRecord.buildList([{ age: 5 }], { parent });

    expect(records[0].parent).toBe(parent);
  });
});

describe('#extractFromData', () => {
  it('sets properties from a plain object', () => {
    const record = new TestRecord();

    record.extractFromData({ age: '5', date: '2019-06-27T00:00:00-07:00' });

    expect(record.age).toBe(5);
    expect(record.date).toEqual(new Date('2019-06-27T00:00:00-07:00'));
  });

  it('creates objects from data when necessary', () => {
    const record = new TestRecord();

    record.extractFromData({ events: [{ note: 'Hello World' }] });

    expect(record.events).toHaveLength(1);
    expect(record.events[0]).toBeInstanceOf(Event);
    expect(record.events[0].eventable).toBe(record);
  });
});
