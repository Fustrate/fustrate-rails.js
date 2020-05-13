import { Moment } from 'moment';

declare module "@fustrate/rails/utilities" {
    export function animate(element: HTMLElement, animation: string, options?: { delay?: string, speed?: string }, callback?: () => void): void;
    export function elementFromString<T extends HTMLElement>(string: string): T;
    export function hms(seconds: number, zero?: boolean): string;
    export function icon(types: string, style?: string): string;
    export function label(text: string, type?: string): string;
    export function multilineEscapeHTML(string: string): string;
    export function linkTo(text: string, href?: string | any, attributes?: { [s: string]: any }): string;
    export function redirectTo(href: string | any): void;
    export function toHumanDate(momentObject: Moment, time?: boolean): string;
}
