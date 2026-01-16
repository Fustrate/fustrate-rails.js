import 'reflect-metadata';

type DecoratorName = string | symbol;

type TypedMethodDecorator<T> = (
  target: object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
  // biome-ignore lint/suspicious/noConfusingVoidType: This is a valid use of void in a decorator context
) => TypedPropertyDescriptor<T> | void;

export function decorateMethod<T = any>(name: DecoratorName): TypedMethodDecorator<T> {
  return (target, key) => {
    Reflect.defineMetadata(name, [...(Reflect.getMetadata(name, target) ?? []), key], target);
  };
}

export function callDecoratedMethods<T = any>(obj: object, name: DecoratorName, ...args: any[]): T[] {
  const taggedMethods: (string | symbol)[] = Reflect.getMetadata(name, Object.getPrototypeOf(obj)) ?? [];

  return taggedMethods.map((name) => obj[name](...args));
}
