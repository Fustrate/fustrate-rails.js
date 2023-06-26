import Listenable from './listenable';

export default abstract class BasicObject extends Listenable {
  public static build<T extends typeof BasicObject>(this: T, data?: { [s: string]: any }, attributes?: { [s: string]: any }): InstanceType<T>;
  public static buildList<T extends typeof BasicObject>(this: T, items: any[], attributes?: { [s: string]: any }): InstanceType<T>[];

  public constructor(data?: number | string);

  public extractObjectsFromData(data: { [s: string]: any }): void;

  public get isBasicObject(): boolean;

  protected extractFromData(data: { [s: string]: any }): { [s: string]: any };
}
