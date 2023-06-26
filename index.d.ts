import type GenericPage from './generic_page';

export default class Fustrate {
    public static instance: GenericPage;

    public constructor();

    public static start(klass: typeof GenericPage): void;

    protected static initialize(): void;
}
