import { deepExtend } from './object';

import Listenable from './listenable';

export default class BasicObject extends Listenable {
  static async build(data, attributes = {}) {
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

    await record.extractFromData(deepExtend({}, data, attributes));

    return record;
  }

  static async buildList(items, attributes = {}) {
    if (!Array.isArray(items)) {
      return [];
    }

    return Promise.all(items.map(async (item) => this.build(item, attributes)));
  }

  // Simple extractor to assign root keys as properties in the current object.
  async extractFromData(data) {
    if (!data) {
      return {};
    }

    Object.getOwnPropertyNames(data).forEach((key) => {
      this[key] = data[key];
    }, this);

    await this.extractObjectsFromData(data);

    this.dispatchEvent(new CustomEvent('extracted'));

    return data;
  }

  // eslint-disable-next-line no-unused-vars
  async extractObjectsFromData(data) {
    // This is a hook.
  }

  get isBasicObject() {
    return true;
  }
}
