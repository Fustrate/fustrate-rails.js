import assert from 'assert';
import BasicObject from '../src/js/basic_object';

class Event extends BasicObject {
  extractFromData(data) {
    if (!data) {
      return {};
    }

    if (data.note) { this.note = data.note; }
    if (data.eventable) { this.eventable = data.eventable; }

    return data;
  }
}

class Record extends BasicObject {
  extractFromData(data) {
    if (!data) {
      return {};
    }

    if (data.date) { this.date = new Date(data.date); }
    if (data.events) { this.events = Event.buildList(data.events, { eventable: this }); }
    if (data.parent) { this.parent = data.parent; }

    this.age = parseInt(data.age, 10);

    return data;
  }
}

describe('::buildList', () => {
  it('builds an array of objects', () => {
    const records = Record.buildList([{ age: 5 }, { age: 10 }, { age: 15 }]);

    assert.strictEqual(records.length, 3);
    assert(records[0] instanceof Record);
    assert.strictEqual(records[1].age, 10);
  });

  it('builds an array of objects with extra attributes', () => {
    const parent = new Record();
    const records = Record.buildList([{ age: 5 }], { parent });

    assert(records[0].parent === parent);
  });
});

describe('#extractFromData', () => {
  it('sets properties from a plain object', () => {
    const record = new Record();

    record.extractFromData({ age: '5', date: '2019-06-27T00:00:00-07:00' });

    assert.strictEqual(record.age, 5);
    assert.deepStrictEqual(record.date, new Date('2019-06-27T00:00:00-07:00'));
  });

  it('creates objects from data when necessary', () => {
    const record = new Record();

    record.extractFromData({ events: [{ note: 'Hello World' }] });

    assert.strictEqual(record.events.length, 1);
    assert(record.events[0] instanceof Event);
    assert(record.events[0].eventable === record);
  });
});
