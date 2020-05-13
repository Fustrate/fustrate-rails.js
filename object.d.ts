declare module "@fustrate/rails/object" {
    export function isPlainObject(object: any): boolean;
    export function deepExtend(out: object, ...rest: object[]): object;
}
