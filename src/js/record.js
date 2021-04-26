import { fire } from '@rails/ujs';

import BasicObject from './basic_object';
import FormDataBuilder from './form_data_builder';
import ajax from './ajax';

export default class Record extends BasicObject {
  // static classname = 'Subreddit::GameThread';

  get classname() {
    return this.constructor.classname;
  }

  constructor(data) {
    super();

    if (typeof data === 'number' || typeof data === 'string') {
      // If the parameter was a number or string, it's likely the record ID
      this.id = parseInt(data, 10);
    }

    this.isLoaded = false;
  }

  reload({ force } = {}) {
    if (this.isLoaded && !force) {
      return Promise.resolve();
    }

    return ajax.get(this.path({ format: 'json' })).then((response) => {
      this.extractFromData(response.data);

      this.isLoaded = true;

      this.dispatchEvent(new CustomEvent('reloaded'));

      return response.data;
    });
  }

  update(attributes = {}, additionalParameters = {}) {
    let url;

    if (this.id) {
      url = this.path({ format: 'json' });
    } else {
      this.extractFromData(attributes);

      url = this.constructor.createPath({ format: 'json' });
    }

    const data = FormDataBuilder.build(attributes, this.constructor.paramKey);

    Object.keys(additionalParameters).forEach((key) => {
      data.append(key, additionalParameters[key]);
    });

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

  delete(params = {}) {
    return ajax.delete(this.path({ format: 'json' }), { params });
  }

  static get paramKey() {
    return this.classname.replace(/::/g, '').replace(/^[A-Z]/, (match) => match.toLowerCase());
  }

  // returns Promise<Record>
  static create(attributes, additionalParameters = {}) {
    const record = new this();

    return record.update(attributes, additionalParameters).then(() => record);
  }
}
