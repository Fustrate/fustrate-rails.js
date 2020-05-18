export const isPlainObject = (object) => {
  // Do the inexpensive checks first.
  if (typeof object !== 'object' || Array.isArray(object) || object == null) {
    return false;
  }

  // isBasicObject is a getter on BasicObject - any sort of basic record shouldn't be iterated
  // We also don't want to mess with Moment objects.
  return !object.isBasicObject && object.constructor.name !== 'Moment';
};

export const deepExtend = (out, ...rest) => {
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
