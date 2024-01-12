export function isPlainObject(object: any): boolean {
  // Do the inexpensive checks first.
  if (typeof object !== 'object' || Array.isArray(object) || object == null) {
    return false;
  }

  // isBasicObject is a getter on BasicObject - any sort of basic record shouldn't be iterated
  // We also don't want to mess with Luxon's DateTime objects.
  return !object.isBasicObject && !object.isLuxonDateTime;
};

export function deepExtend(out: object, ...rest: object[]): object {
  out = out || {};

  rest
    .filter((obj) => obj)
    .forEach((obj) => {
      Object.getOwnPropertyNames(obj).forEach((key) => {
        out[key] = isPlainObject(obj[key]) ? deepExtend(out[key], obj[key]) : obj[key];
      });
    });

  return out;
};
