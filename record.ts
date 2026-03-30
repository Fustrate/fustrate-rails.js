import type { KyResponse } from 'ky';

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

  public path(_options?: { format?: string }): string {
    throw new Error('No path implemented.');
  }

  public constructor(id?: number | string) {
    super();

    if (id != null) {
      this.id = Number(id);
    }

    this.isLoaded = false;
  }

  public async reload(options?: { force?: boolean }): Promise<KyResponse | undefined> {
    if (this.isLoaded && !options?.force) {
      return void 0;
    }

    const response = await ajax.get(this.path({ format: 'json' }));
    const { data } = await response.json<{ data: Record<string, any> }>();

    this.extractFromData(data);

    this.isLoaded = true;

    this.dispatchEvent(new CustomEvent('reloaded'));

    return response;
  }

  public async update(attributes: Parameters, additionalParameters?: AdditionalParameters): Promise<KyResponse> {
    let url: string;

    if (this.id) {
      url = this.path({ format: 'json' });
    } else {
      this.extractFromData(attributes);

      url = this.class.createPath({ format: 'json' });
    }

    const paramKey =
      this.class.paramKey || this.classname.replace(/::/g, '').replace(/^[A-Z]/, (match) => match.toLowerCase());

    const formData = formDataBuilder(attributes, paramKey);

    if (additionalParameters) {
      for (const [key, value] of Object.entries(additionalParameters)) {
        if (value != null) {
          formData.append(key, value instanceof Blob ? value : String(value));
        }
      }
    }

    const response = await ajax(url, {
      method: this.id ? 'patch' : 'post',
      body: formData,
      onUploadProgress: (event) => {
        fire(this, 'upload:progress', event);
      },
    });

    const { data } = await response.json<{ data: Record<string, any> }>();

    this.extractFromData(data);

    this.isLoaded = true;

    this.dispatchEvent(new CustomEvent('updated'));

    return response;
  }

  public async delete(): Promise<KyResponse> {
    return ajax.delete(this.path({ format: 'json' }));
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
