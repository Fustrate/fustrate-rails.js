import type Listenable from '@fustrate/rails/listenable';

interface MatchesOptions {
  selector: string;
  exclude: string;
}

export function delegate<K extends keyof HTMLElementEventMap>(element: HTMLElement, selector: string | MatchesOptions, eventType: K, handler: (ev: HTMLElementEventMap[K]) => any): void;
export function fire<T = any>(target: EventTarget | Listenable, name: string, detail?: T): boolean;
export function stopEverything(event: Event): void;
