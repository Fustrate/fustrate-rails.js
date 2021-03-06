import moment from 'moment';
import { deepExtend } from './object';

import Listenable from './listenable';

export default class BasicObject extends Listenable {
  // Simple extractor to assign root keys as properties in the current object.
  // Formats a few common attributes as dates with moment.js
  extractFromData(data) {
    if (!data) {
      return {};
    }

    Object.getOwnPropertyNames(data).forEach((key) => {
      this[key] = data[key];
    }, this);

    if (this.date && !moment.isMoment(this.date)) {
      this.date = moment(this.date);
    }

    if (this.createdAt && !moment.isMoment(this.createdAt)) {
      this.createdAt = moment(this.createdAt);
    }

    if (this.updatedAt && !moment.isMoment(this.updatedAt)) {
      this.updatedAt = moment(this.updatedAt);
    }
    
    this.extractObjectsFromData(data);
    
    this.dispatchEvent(new CustomEvent('extracted'));

    return data;
  }
  
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
