// Travel the prototype chain and get up to 10 levels of property descriptors.
function buildDecorationList(obj) {
  const decorations = {};

  let proto = Object.getPrototypeOf(obj);
  let level = 0;

  while (proto != null && level < 10) {
    Object.entries(Object.getOwnPropertyDescriptors(proto)).forEach(([name, descriptor]) => {
      if (descriptor.value && descriptor.value.$tags) {
        descriptor.value.$tags.forEach((tag) => {
          if (!decorations[tag]) {
            decorations[tag] = [];
          }

          decorations[tag].push(name);
        });
      }
    });

    proto = Object.getPrototypeOf(proto);
    level += 1;
  }

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
    return [...obj.$decoratedMethods[tag]].map((name) => obj[name]());
  }

  return [];
}
