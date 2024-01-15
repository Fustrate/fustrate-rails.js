import pull from 'lodash/pull';

// A simple polyfill for objects that aren't DOM nodes to receive events.
export default class Listenable {
  protected listeners: Record<string, ((event: CustomEvent) => void)[]> = {};

  constructor() {
    this.listeners = {};
  }

  public addEventListener<T = CustomEvent<any>>(type: string, listener: (event: T) => void): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(listener as (event: CustomEvent<any>) => void);
  }

  public removeEventListener(type: string, listener: (event: CustomEvent) => void): void {
    pull(this.listeners[type], listener);
  }

  public dispatchEvent(event: CustomEvent): boolean {
    if (!(event.type && this.listeners[event.type])) {
      return true;
    }

    this.listeners[event.type].forEach((listener) => {
      listener.call(this, event);
    });

    return true;
  }
}
