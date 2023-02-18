function buildDecorationList(obj) {
  const decorations = {};

  Object.entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj)))
    .forEach(([name, descriptor]) => {
      if (descriptor.value && descriptor.value.$tags) {
        descriptor.value.$tags.forEach((tag) => {
          if (!decorations[tag]) {
            decorations[tag] = [];
          }

          decorations[tag].push(name);
        });
      }
    });

  return decorations;
}

export function decorateMethod(tag) {
  return (target, key, descriptor) => {
    if (!descriptor.value.$tags) {
      descriptor.value.$tags = new Set();
    }

    descriptor.value.$tags.add(tag);
  };
}

export function callDecoratedMethods(obj, tag) {
  if (!obj.$decoratedMethods) {
    obj.$decoratedMethods = buildDecorationList(obj);
  }

  if (obj.$decoratedMethods[tag]) {
    obj.$decoratedMethods[tag].forEach((name) => {
      obj[name]();
    });
  }
}
