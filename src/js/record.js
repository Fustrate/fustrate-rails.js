import { fire } from '@rails/ujs';

import BasicObject from './basic_object';
import FormDataBuilder from './form_data_builder';
import ajax, { get } from './ajax';

export default class Record extends BasicObject {
  // static get classname() { return 'Subreddit::GameThread'; }

  get classname() {
    return this.constructor.classname;
  }

  constructor(data) {
    super(data);

    this.isLoaded = false;

    if (typeof data === 'number' || typeof data === 'string') {
      // If the parameter was a number or string, it's likely the record ID
      this.id = parseInt(data, 10);
    } else {
      // Otherwise we were probably given a hash of attributes
      this.extractFromData(data);
    }
  }

  reload({ force } = {}) {
    if (this.isLoaded && !force) {
      return Promise.resolve();
    }

    return get(this.path({ format: 'json' })).then((response) => {
      this.extractFromData(response.data);

      this.isLoaded = true;

      return response.data;
    });
  }

  update(attributes = {}) {
    let url;

    if (this.id) {
      url = this.path({ format: 'json' });
    } else {
      this.extractFromData(attributes);

      url = this.constructor.createPath({ format: 'json' });
    }

    return ajax({
      method: this.id ? 'patch' : 'post',
      url,
      data: FormDataBuilder.build(attributes, this.constructor.paramKey),
      onUploadProgress: (event) => {
        fire(this, 'upload:progress', event);
      },
    }).catch(() => {}).then((response) => {
      this.extractFromData(response.data);

      this.isLoaded = true;

      return response.data;
    });
  }

  delete() {
    return ajax.delete(this.path({ format: 'json' }));
  }

  static get paramKey() {
    return this.classname.replace(/::/g, '').replace(/^[A-Z]/, match => match.toLowerCase());
  }

  // returns Promise<Record>
  static create(attributes) {
    const record = new this();

    return record.update(attributes).then(() => record);
  }
}
