import BasicObject from './basic-object';

function appendObject(data: FormData, key: string, value: any): void {
  if (Array.isArray(value)) {
    if (value.some((item) => typeof item === 'object')) {
      for (const [index, item] of value.entries()) {
        toFormData(data, item, `${key}[${index}]`);
      }
    } else {
      for (const item of value) {
        data.append(`${key}[]`, String(item));
      }
    }
  } else if (value instanceof Blob) {
    data.append(key, value);
  } else if (!(value instanceof BasicObject)) {
    toFormData(data, value, key);
  }
}

function toFormData(data: FormData, obj: Record<string, any>, namespace?: string): FormData {
  for (const field of Object.getOwnPropertyNames(obj)) {
    if (obj[field] === undefined || Number.isNaN(obj[field])) {
      continue;
    }

    const key = namespace ? `${namespace}[${field}]` : field;

    if (obj[field] && typeof obj[field] === 'object') {
      appendObject(data, key, obj[field]);
    } else if (typeof obj[field] === 'boolean') {
      data.append(key, String(Number(obj[field])));
    } else if (obj[field] != null) {
      data.append(key, obj[field]);
    }
  }

  return data;
}

export default function build(obj: Record<string, any>, namespace?: string): FormData {
  return toFormData(new FormData(), obj, namespace);
}
