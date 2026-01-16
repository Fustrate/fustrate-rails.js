export function isPlainObject(object: any): boolean {
  // Do the inexpensive checks first.
  if (typeof object !== 'object' || Array.isArray(object) || object == null) {
    return false;
  }

  // isBasicObject is a getter on BasicObject - any sort of basic record shouldn't be iterated
  // We also don't want to mess with Luxon's DateTime objects.
  return !object.isBasicObject && !object.isLuxonDateTime;
}

export function deepExtend(input: object | null, ...rest: object[]): object {
  const output = input ?? {};

  for (const obj of rest.filter(Boolean)) {
    for (const key of Object.getOwnPropertyNames(obj)) {
      output[key] = isPlainObject(obj[key]) ? deepExtend(output[key], obj[key]) : obj[key];
    }
  }

  return output;
}

// es-toolkit doesn't provide a `set` function for deep object paths, so we implement our own
export function objectFromPath(path: string, value: any): object {
  const parts = path.split('.');
  const result: any = {};
  let current = result;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const match = /^(.+?)\[(\d+)\]$/.exec(part);

    if (match) {
      const [, key, index] = match;
      const idx = Number.parseInt(index, 10);

      if (!current[key]) {
        current[key] = [];
      }

      if (!current[key][idx]) {
        current[key][idx] = {};
      }

      current = current[key][idx];
    } else {
      if (!current[part]) {
        current[part] = {};
      }

      current = current[part];
    }
  }

  const lastPart = parts[parts.length - 1];
  const match = /^(.+?)\[(\d+)\]$/.exec(lastPart);

  if (match) {
    const [, key, index] = match;
    const idx = Number.parseInt(index, 10);

    if (!current[key]) {
      current[key] = [];
    }

    current[key][idx] = value;
  } else {
    current[lastPart] = value;
  }

  return result;
}
