import { callDecoratedMethods, decorateMethod } from './decorators';
import Listenable from './listenable';
import { deepExtend } from './object';

const $basicObjectExtractData = Symbol('$basicObjectExtractData');

export const extractData = decorateMethod($basicObjectExtractData);

export default class BasicObject extends Listenable {
  public isBasicObject = true;

  public static build<T extends typeof BasicObject>(
    this: T,
    data?: Record<string, any>,
    attributes?: Record<string, any>,
  ): InstanceType<T> | null {
    if (!data) {
      return null;
    }

    if (data instanceof this) {
      return data as InstanceType<T>;
    }

    const record = new this();

    record.extractFromData(
      deepExtend({}, typeof data === 'string' || typeof data === 'number' ? { id: data } : data, attributes ?? {}),
    );

    return record as InstanceType<T>;
  }

  public static buildList<T extends typeof BasicObject>(
    this: T,
    items: any[],
    attributes?: Record<string, any>,
  ): InstanceType<T>[] {
    if (!Array.isArray(items)) {
      return [];
    }

    return items.map((item) => this.build(item, attributes)) as InstanceType<T>[];
  }

  public constructor(_data?: number | string) {
    super();
  }

  // Simple extractor to assign root keys as properties in the current object.
  public extractFromData(data?: Record<string, any>): Record<string, any> {
    if (data == null) {
      return {};
    }

    for (const key of Object.getOwnPropertyNames(data)) {
      this[key] = data[key];
    }

    // Any more advanced extraction can be done in separate methods
    callDecoratedMethods(this, $basicObjectExtractData, data);

    this.dispatchEvent(new CustomEvent('extracted'));

    return data;
  }
}
