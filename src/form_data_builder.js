import BasicObject from './basic_object';

export default class FormDataBuilder {
  static build(obj, namespace = null) {
    return this.toFormData(new FormData(), obj, namespace);
  }

  static appendObject(data, key, value) {
    if (Array.isArray(value)) {
      if (value.some((item) => typeof item === 'object')) {
        value.forEach((item, index) => {
          this.toFormData(data, item, `${key}[${index}]`);
        });
      } else {
        value.forEach((item) => {
          data.append(`${key}[]`, String(item));
        });
      }
    } else if (value instanceof Blob) {
      data.append(key, value);
    } else if (!(value instanceof BasicObject)) {
      this.toFormData(data, value, key);
    }
  }

  static toFormData(data, obj, namespace = null) {
    Object.getOwnPropertyNames(obj).forEach((field) => {
      if (typeof obj[field] === 'undefined' || Number.isNaN(obj[field])) {
        return;
      }

      const key = namespace ? `${namespace}[${field}]` : field;

      if (obj[field] && typeof obj[field] === 'object') {
        this.appendObject(data, key, obj[field]);
      } else if (typeof obj[field] === 'boolean') {
        data.append(key, String(Number(obj[field])));
      } else if (obj[field] != null) {
        data.append(key, obj[field]);
      }
    });

    return data;
  }
}
