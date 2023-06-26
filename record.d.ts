import type { AxiosResponse } from 'axios';
import BasicObject from './basic_object';

export type ParamValue = string | number | boolean | null | undefined | File | ParamValue[] | { [s: string]: ParamValue };
export type Parameters = { [s: string]: ParamValue };

export default class Record extends BasicObject {
  public static classname: string;

  public id?: number;
  protected isLoaded: boolean;

  public constructor(data?: number | string);

  public delete(params?: Parameters): Promise<AxiosResponse<any>>;
  public extractFromData(data: number | string | { [s: string]: any }): { [s: string]: any };
  public path(options?: { format?: string }): string;
  public reload(options?: { force?: boolean }): Promise<AxiosResponse<any>>;
  public update(attributes: Parameters, additionalParameters?: Parameters): Promise<AxiosResponse<any>>;

  public get classname(): string;

  public static create<T extends typeof Record>(this: T, attributes: { [s: string]: any }, additionalParameters?: Parameters): Promise<InstanceType<T>>;

  public static get paramKey(): string;
}
