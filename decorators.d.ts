import type { GenericPage } from './index';

type DecoratorTypes = 'autorefresh';

export function autorefresh(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;

export function callDecoratedMethods(instance: GenericPage, type: DecoratorTypes): void;
