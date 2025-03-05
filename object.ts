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
