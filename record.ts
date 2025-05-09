import type { AxiosResponse } from 'axios';

import ajax from './ajax';
import BasicObject from './basic-object';
import { fire } from './events';
import formDataBuilder from './form-data-builder';
import { underscore } from './string';

type RequiredParameter = string | number | { id: number } | { toParam?: number | string };
// type OptionalParameter = string | number | null | undefined;
type AnyParameter = RequiredParameter | string[] | number[] | null | undefined;

interface RouteOptions {
  [s: string]: AnyParameter;
  format?: string;
}

export type ParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Blob
  | ParamValue[]
  | { [s: string]: ParamValue };

export type Parameters = Record<string, ParamValue>;

// Additional parameters are not recursively processed like the record parameters are.
export type AdditionalParameters = Record<string, string | Blob | number | null | undefined>;

export default class BaseRecord extends BasicObject {
  public static classname: string;
  public static paramKey: string;
  public static createPath: (options?: RouteOptions) => string;

  public id?: number;
  protected isLoaded: boolean;

  public get classname(): string {
    return this.class.classname;
  }

  public get langScope(): string {
    return underscore(this.classname);
  }

  protected get class() {
    return this.constructor as typeof BaseRecord;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public path(options?: { format?: string }): string {
    throw new Error('No path implemented.');
  }

  public constructor(id?: number | string) {
    super();

    if (id != null) {
      this.id = Number(id);
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

  public async update(attributes: Parameters, additionalParameters?: AdditionalParameters): Promise<AxiosResponse> {
    let url: string;

    if (this.id) {
      url = this.path({ format: 'json' });
    } else {
      this.extractFromData(attributes);

      url = this.class.createPath({ format: 'json' });
    }

    const paramKey =
      this.class.paramKey || this.classname.replace(/::/g, '').replace(/^[A-Z]/, (match) => match.toLowerCase());

    const data = formDataBuilder(attributes, paramKey);

    if (additionalParameters) {
      for (const [key, value] of Object.entries(additionalParameters)) {
        if (value != null) {
          data.append(key, value instanceof Blob ? value : String(value));
        }
      }
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
