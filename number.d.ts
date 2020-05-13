declare module "@fustrate/rails/number" {
    export function accountingFormat(number: number): string;
    export function truncate(number: number, digits: number): string;
    export function bytesToString(number: number): string;
    export function ordinalize(number: number): string;
}
