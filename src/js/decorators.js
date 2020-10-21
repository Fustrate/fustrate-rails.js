const decoratedMethodsRegistry = {
  autorefresh: {},
};

function addDecoratedMethod(className, type, methodName) {
  if (!decoratedMethodsRegistry[type]) {
    decoratedMethodsRegistry[type] = {};
  }

  if (!decoratedMethodsRegistry[type][className]) {
    decoratedMethodsRegistry[type][className] = [];
  }

  decoratedMethodsRegistry[type][className].push(methodName);
}

export function autorefresh() {
  return (target, propertyKey) => {
    addDecoratedMethod(target.constructor.name, 'autorefresh', propertyKey);
  };
}

export function callDecoratedMethods(instance, type) {
  const methods = decoratedMethodsRegistry[type][instance.constructor.name] || [];

  methods.forEach((methodName) => {
    instance[methodName].apply(instance);
  });
}
