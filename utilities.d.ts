import type { DateTime } from 'luxon';

export function animate(element: HTMLElement, animation: string, options?: { delay?: string, speed?: string }, callback?: () => void): void;
export function elementFromString<T extends HTMLElement>(string: string): T;
export function hms(seconds: number, zeroDisplay?: string): string;
export function icon(types: string, style?: string): string;
export function label(text: string, ...classes: string[]): string;
export function multilineEscapeHTML(string: string): string;
export function linkTo(text: string, href?: string | any, attributes?: { [s: string]: any }): string;
export function redirectTo(href: string | any): void;
export function toHumanDate(dateTimeObject: DateTime, time?: boolean): string;
