// interface MethodDecoratorTarget {
//     kind: 'method';
//     key: string | symbol;
//     placement: 'prototype';
// }

// type DecoratorFunction = (target: MethodDecoratorTarget, key: string, descriptor: PropertyDescriptor) => void;

export function callDecoratedMethods(obj: object, tag: string): void;

export function decorateMethod(value: string): any;
