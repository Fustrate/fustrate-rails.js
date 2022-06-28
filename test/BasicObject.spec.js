/* eslint-disable max-classes-per-file */

import BasicObject from '../src/js/basic_object';

class Event extends BasicObject {
  extractFromData(data) {
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

class Record extends BasicObject {
  async extractFromData(data) {
    if (!data) {
      return {};
    }

    if (data.date) {
      this.date = new Date(data.date);
    }

    if (data.events) {
      this.events = await Event.buildList(data.events, { eventable: this });
    }

    if (data.parent) {
      this.parent = data.parent;
    }

    this.age = parseInt(data.age, 10);

    return data;
  }
}

describe('::buildList', () => {
  it('builds an array of objects', async () => {
    const records = await Record.buildList([{ age: 5 }, { age: 10 }, { age: 15 }]);

    expect(records).toHaveLength(3);
    expect(records[0]).toBeInstanceOf(Record);
    expect(records[1].age).toBe(10);
  });

  it('builds an array of objects with extra attributes', async () => {
    const parent = new Record();
    const records = await Record.buildList([{ age: 5 }], { parent });

    expect(records[0].parent).toBe(parent);
  });
});

describe('#extractFromData', () => {
  it('sets properties from a plain object', async () => {
    const record = new Record();

    await record.extractFromData({ age: '5', date: '2019-06-27T00:00:00-07:00' });

    expect(record.age).toBe(5);
    expect(record.date).toEqual(new Date('2019-06-27T00:00:00-07:00'));
  });

  it('creates objects from data when necessary', async () => {
    const record = new Record();

    await record.extractFromData({ events: [{ note: 'Hello World' }] });

    expect(record.events).toHaveLength(1);
    expect(record.events[0]).toBeInstanceOf(Event);
    expect(record.events[0].eventable).toBe(record);
  });
});
