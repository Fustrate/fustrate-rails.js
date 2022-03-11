import { deepExtend } from './object';

import Listenable from './listenable';

export default class BasicObject extends Listenable {
  // Simple extractor to assign root keys as properties in the current object.
  extractFromData(data) {
    if (!data) {
      return {};
    }

    Object.getOwnPropertyNames(data).forEach((key) => {
      this[key] = data[key];
    }, this);

    this.extractObjectsFromData(data);

    this.dispatchEvent(new CustomEvent('extracted'));

    return data;
  }

  // eslint-disable-next-line no-unused-vars
  extractObjectsFromData(data) {
    // This is a hook.
  }

  get isBasicObject() {
    return true;
  }

  static build(data, attributes = {}) {
    if (!data) {
      return undefined;
    }

    if (data instanceof this) {
      return data;
    }

    if (typeof data === 'string' || typeof data === 'number') {
      data = { id: data };
    }

    const record = new this();

    record.extractFromData(deepExtend({}, data, attributes));

    return record;
  }

  static buildList(items, attributes = {}) {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.map((item) => this.build(item, attributes));
  }
}
