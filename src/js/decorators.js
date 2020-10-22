// I couldn't figure out how to make this work with "non-legacy" decorators - there doesn't seem to
// be a way to access the parent class of the data/descriptor that gets passed to the decorator.
const decoratedMethodsCache = {
  autorefresh: {},
};

export function autorefresh() {
  return (target, propertyKey) => {
    const { name } = target.constructor;

    if (!decoratedMethodsCache.autorefresh[name]) {
      decoratedMethodsCache.autorefresh[name] = [];
    }

    decoratedMethodsCache.autorefresh[name].push(propertyKey);
  };
}

export function callDecoratedMethods(instance, type) {
  const { name } = instance.constructor;

  const methods = decoratedMethodsCache[type][name] || [];

  methods.forEach((methodName) => {
    instance[methodName].apply(instance);
  });
}
