import { deepExtend } from './object';

import Listenable from './listenable';

export default class BasicObject extends Listenable {
  public static build<T extends typeof BasicObject>(this: T, data?: { [s: string]: any }, attributes?: { [s: string]: any }): InstanceType<T> | null {
    if (!data) {
      return null;
    }

    if (data instanceof this) {
      return data as InstanceType<T>;
    }

    if (typeof data === 'string' || typeof data === 'number') {
      data = { id: data };
    }

    const record = new this();

    record.extractFromData(deepExtend({}, data, attributes || {}));

    return record as InstanceType<T>;
  }

  public static buildList<T extends typeof BasicObject>(this: T, items: any[], attributes?: { [s: string]: any }): InstanceType<T>[] {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.map((item) => this.build(item, attributes)) as InstanceType<T>[];
  }

  public constructor(data?: number | string) {
    super();
  }

  // Simple extractor to assign root keys as properties in the current object.
  public extractFromData(data: { [s: string]: any }): { [s: string]: any } {
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
  public extractObjectsFromData(data: { [s: string]: any }): void {
    // This is a hook.
  }

  public get isBasicObject(): boolean {
    return true;
  }
}
