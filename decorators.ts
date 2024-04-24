// Travel the prototype chain and get up to 10 levels of property descriptors.
function buildDecorationList(obj: object) {
  const decorations = {};

  let proto = Object.getPrototypeOf(obj);
  let level = 0;

  while (proto != null && level < 10) {
    Object.entries(Object.getOwnPropertyDescriptors(proto)).forEach(([name, descriptor]) => {
      if (descriptor.value?.$tags) {
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

export function decorateMethod(tag: string): MethodDecorator {
  return (target, key, descriptor) => {
    if (!(descriptor.value as any).$tags) {
      (descriptor.value as any).$tags = new Set();
    }

    (descriptor.value as any).$tags.add(tag);
  };
}

export function callDecoratedMethods<T = any>(obj: object, tag: string): T[] {
  if (!(obj as any).$decoratedMethods) {
    (obj as any).$decoratedMethods = buildDecorationList(obj);
  }

  if ((obj as any).$decoratedMethods[tag]) {
    return [...(obj as any).$decoratedMethods[tag]].map((name) => obj[name]());
  }

  return [];
}
