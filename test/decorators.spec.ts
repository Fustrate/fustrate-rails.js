import { decorateMethod, callDecoratedMethods } from '../decorators';

const oneArgSymbol = Symbol('$oneArg');

const simple = decorateMethod('$simple');

const oneArg = decorateMethod(oneArgSymbol);

const manyArgs = decorateMethod('$manyArgs');

const dynamic = (name: string) => decorateMethod(name);

class BaseClass {
  public callDecoratedMethods() {
    return callDecoratedMethods(this, '$simple');
  }

  public callDecoratedMethodsWithOneArg(arg: number) {
    return callDecoratedMethods(this, oneArgSymbol, arg);
  }

  public callDecoratedMethodsWithManyArgs(one: number, two: string, three: Record<string, number>) {
    return callDecoratedMethods(this, '$manyArgs', one, two, three);
  }

  public callDynamicDecorator(name: string, ...args: any[]) {
    return callDecoratedMethods(this, name, ...args);
  }
}

class Subclass extends BaseClass {
  @simple
  protected aSimpleMethod() {
    return 1;
  }

  @simple
  protected anotherSimpleMethod() {
    return 11;
  }

  @simple
  protected oneMoreSimpleMethod() {
    return 111;
  }

  @oneArg
  protected oneArgMethod(arg: number) {
    return arg + 1;
  }

  @oneArg
  protected anotherOneArgMethod(arg: number) {
    return arg - 8;
  }

  @manyArgs
  protected manyArgsMethod(one: number, two: string, three: Record<string, number>) {
    return `${two}: ${one + Object.values(three).reduce((total, num) => total + num)}`;
  }

  @dynamic('potato')
  protected makeFries(sentence: string) {
    return sentence.split(' ');
  }
}

describe('decorateMethod', () => {
  it('joins words and stuff', () => {
    const record = new Subclass();

    expect(Reflect.getMetadata(oneArgSymbol, Object.getPrototypeOf(record)))
      .toStrictEqual(['oneArgMethod', 'anotherOneArgMethod']);

    expect(record.callDecoratedMethods()).toStrictEqual([1, 11, 111]);

    expect(record.callDecoratedMethodsWithOneArg(7)).toStrictEqual([8, -1]);

    expect(record.callDecoratedMethodsWithManyArgs(3, 'total', { five: 5, eleven: 11 }))
      .toStrictEqual(['total: 19']);

    expect(record.callDynamicDecorator('potato', 'porpoise purpose'))
      .toStrictEqual([['porpoise', 'purpose']]);
  });
});
