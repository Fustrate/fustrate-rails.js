export function decorateMethod(tag) {
  return (target, key, descriptor) => {
    descriptor.value[tag] = true;
  };
}

export function callDecoratedMethods(obj, tag) {
  const descriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj));

  Object.entries(descriptors).forEach(([name, descriptor]) => {
    if (descriptor.value && descriptor.value[tag]) {
      obj[name]();
    }
  });
}
