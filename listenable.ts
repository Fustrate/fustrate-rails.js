import { pull } from 'es-toolkit/array';

// A simple polyfill for objects that aren't DOM nodes to receive events.
export default class Listenable {
  protected listeners: Record<string, ((event: CustomEvent) => void)[]> = {};

  constructor() {
    this.listeners = {};
  }

  public addEventListener<T = CustomEvent>(type: string, listener: (event: T) => void): void {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(listener as (event: CustomEvent) => void);
  }

  public removeEventListener(type: string, listener: (event: CustomEvent) => void): void {
    pull(this.listeners[type], [listener]);
  }

  public dispatchEvent(event: CustomEvent): boolean {
    if (!(event.type && event.type in this.listeners)) {
      return true;
    }

    for (const listener of this.listeners[event.type]) {
      listener.call(this, event);
    }

    return true;
  }
}
