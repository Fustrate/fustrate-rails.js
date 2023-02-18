export function decorateMethod(tag) {
  return (target, key, descriptor) => {
    if (!descriptor.value.$tags) {
      descriptor.value.$tags = new Set();
    }

    descriptor.value.$tags.add(tag);
  };
}

export function callDecoratedMethods(obj, tag) {
  const descriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj));

  Object.entries(descriptors).forEach(([name, descriptor]) => {
    if (descriptor.value && descriptor.value.$tags && descriptor.value.$tags.has(tag)) {
      obj[name]();
    }
  });
}
