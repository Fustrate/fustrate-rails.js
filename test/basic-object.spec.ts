/* eslint-disable max-classes-per-file */

import BasicObject from '../basic-object';

class Event extends BasicObject {
  public note: string;
  public eventable: any;

  override extractFromData(data: Record<string, any>) {
    if (!data) {
      return {};
    }

    if (data.note) {
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
  public parent: any;
  public age: number;

  override extractFromData(data: Record<string, any>) {
    if (!data) {
      return {};
    }

    if (data.date) {
      this.date = new Date(data.date);
    }

    if (data.events) {
      this.events = Event.buildList(data.events, { eventable: this });
    }

    if (data.parent) {
      this.parent = data.parent;
    }

    this.age = Number(data.age);

    return data;
  }
}

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
