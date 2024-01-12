import BasicObject from './basic_object';
import FormDataBuilder from './form_data_builder';
import ajax from './ajax';
import { fire } from './events';

import type { AxiosResponse } from 'axios';

export type ParamValue = string | number | boolean | null | undefined | Blob | ParamValue[] | { [s: string]: ParamValue };
export type Parameters = { [s: string]: ParamValue };

export default class Record extends BasicObject {
  public static classname: string;
  public static paramKey: string;
  public static createPath: (options?: { format?: string }) => string;;

  public id?: number;
  protected isLoaded: boolean;

  public get classname(): string {
    return (this.constructor as Function & { classname: string }).classname;
  }

  public path(options?: { format?: string }): string {
    throw new Error('No path implemented.');
  };

  public constructor(data?: number | string) {
    super();

      // If the parameter was a number or string, it's likely the record ID
    if (typeof data === 'number' || typeof data === 'string') {
      this.id = Number(data);
    }

    this.isLoaded = false;
  }

  public async reload(options?: { force?: boolean }): Promise<AxiosResponse<any> | void> {
    if (this.isLoaded && !options?.force) {
      return Promise.resolve();
    }

    return ajax.get(this.path({ format: 'json' })).then((response) => {
      this.extractFromData(response.data);

      this.isLoaded = true;

      this.dispatchEvent(new CustomEvent('reloaded'));

      return response.data;
    });
  }

  public async update(attributes: Parameters, additionalParameters?: { [s: string]: string | Blob }): Promise<AxiosResponse<any>> {
    let url: string;

    if (this.id) {
      url = this.path({ format: 'json' });
    } else {
      this.extractFromData(attributes);

      url = (this.constructor as typeof Record).createPath({ format: 'json' });
    }

    const paramKey = (this.constructor as typeof Record).paramKey
      || this.classname.replace(/::/g, '').replace(/^[A-Z]/, (match) => match.toLowerCase());

    const data = FormDataBuilder.build(attributes, paramKey);

    if (additionalParameters) {
      Object.entries(additionalParameters).forEach(([key, value]) => {
        if (value != null) {
          data.append(key, value);
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

  public async delete(params?: Parameters): Promise<AxiosResponse<any>> {
    return ajax.delete(this.path({ format: 'json' }), { params });
  }

  public static async create<T extends typeof Record>(this: T, attributes: { [s: string]: any }, additionalParameters?: { [s: string]: string | Blob }): Promise<InstanceType<T>> {
    const record = new this() as InstanceType<T>;

    return record.update(attributes, additionalParameters).then(() => record);
  }
}
