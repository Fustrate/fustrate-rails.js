import 'reflect-metadata';

type DecoratorName = string | symbol;

export function decorateMethod(name: DecoratorName): MethodDecorator {
  return (target, key) => {
    Reflect.defineMetadata(name, [...(Reflect.getMetadata(name, target) ?? []), key], target);
  };
}

export function callDecoratedMethods<T = any>(obj: object, name: DecoratorName, ...args: any[]): T[] {
  const taggedMethods: (string | symbol)[] = Reflect.getMetadata(name, Object.getPrototypeOf(obj)) ?? [];

  return taggedMethods.map((name) => obj[name](...args));
}
