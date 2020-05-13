import moment from 'moment';
import { deepExtend } from './object';

import Listenable from './listenable';

export default class BasicObject extends Listenable {
  constructor(data) {
    super();

    if (typeof data === 'object') {
      this.extractFromData(data);
    }
  }

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

    return data;
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

    return new this(deepExtend({}, data, attributes));
  }

  static buildList(items, attributes = {}) {
    return items ? items.map((item) => new this(deepExtend({}, item, attributes))) : [];
  }
}
