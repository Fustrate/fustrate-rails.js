import type { AxiosResponse } from 'axios';

import BasicObject from './basic-object';
import formDataBuilder from './form-data-builder';
import ajax from './ajax';
import { fire } from './events';

export type ParamValue = string | number | boolean | null | undefined | Blob | ParamValue[] |
  { [s: string]: ParamValue };

export type Parameters = Record<string, ParamValue>;

// Additional parameters are not recursively processed like the record parameters are.
export type AdditionalParameters = Record<string, string | Blob | number | null>;

export default class BaseRecord extends BasicObject {
  public static classname: string;
  public static paramKey: string;
  public static createPath: (options?: { format?: string }) => string;

  public id?: number;
  protected isLoaded: boolean;

  public get classname(): string {
    return (this.constructor as typeof BaseRecord & { classname: string }).classname;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public path(options?: { format?: string }): string {
    throw new Error('No path implemented.');
  }

  public constructor(data?: number | string) {
    super();

    // If the parameter was a number or string, it's likely the record ID
    if (typeof data === 'number' || typeof data === 'string') {
      this.id = Number(data);
    }

    this.isLoaded = false;
  }

  public async reload(options?: { force?: boolean }): Promise<AxiosResponse | undefined> {
    if (this.isLoaded && !options?.force) {
      return void 0;
    }

    return ajax.get(this.path({ format: 'json' })).then((response) => {
      this.extractFromData(response.data);

      this.isLoaded = true;

      this.dispatchEvent(new CustomEvent('reloaded'));

      return response.data;
    });
  }

  public async update(
    attributes: Parameters,
    additionalParameters?: AdditionalParameters,
  ): Promise<AxiosResponse> {
    let url: string;

    if (this.id) {
      url = this.path({ format: 'json' });
    } else {
      this.extractFromData(attributes);

      url = (this.constructor as typeof BaseRecord).createPath({ format: 'json' });
    }

    const paramKey = (this.constructor as typeof BaseRecord).paramKey
      || this.classname.replace(/::/g, '').replace(/^[A-Z]/, (match) => match.toLowerCase());

    const data = formDataBuilder(attributes, paramKey);

    if (additionalParameters) {
      Object.entries(additionalParameters).forEach(([key, value]) => {
        if (value != null) {
          data.append(key, value instanceof Blob ? value : String(value));
        }
      });
    }

    return ajax({
      method: this.id ? 'patch' : 'post',
      url,
      data,
      onUploadProgress: (event) => {
        fire(this, 'upload:progress', event);
      },
    }).then((response) => {
      this.extractFromData(response.data);

      this.isLoaded = true;

      this.dispatchEvent(new CustomEvent('updated'));

      return response.data;
    });
  }

  public async delete(params?: Parameters): Promise<AxiosResponse> {
    return ajax.delete(this.path({ format: 'json' }), { params });
  }

  public static async create<T extends typeof BaseRecord>(
    this: T,
    attributes: Record<string, any>,
    additionalParameters?: AdditionalParameters,
  ): Promise<InstanceType<T>> {
    const record = new this() as InstanceType<T>;

    await record.update(attributes, additionalParameters);

    return record;
  }
}
