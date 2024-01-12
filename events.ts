import type Listenable from './listenable';

interface MatchesOptions {
  selector: string;
  exclude: string;
}

// Checks if the given native dom element matches the selector
function matches(element: HTMLElement, selector: string | MatchesOptions) {
  return typeof selector === 'string'
    ? element.matches(selector)
    : element.matches(selector.selector) && !element.matches(selector.exclude);
}

// Triggers a custom event on an element and returns false if the event result is false
export function fire<T = any>(target: EventTarget | Listenable, name: string, detail?: T): boolean {
  const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail });

  target.dispatchEvent(event);

  return !event.defaultPrevented;
}

// Helper function, needed to provide consistent behavior in IE
export function stopEverything(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

// Delegates events to a specified parent `element`, which fires event `handler` for the specified
// `selector` when an event of `eventType` is triggered.

export function delegate<K extends keyof HTMLElementEventMap>(element: HTMLElement, selector: string | MatchesOptions, eventType: K, handler: (ev: HTMLElementEventMap[K]) => any): void;
export function delegate(element: HTMLElement, selector: string | MatchesOptions, eventType: string, handler: EventListenerOrEventListenerObject): void;
export function delegate(element, selector, eventType, handler) {
  element.addEventListener(eventType, (event: UIEvent & { target: HTMLElement }) => {
    let { target } = event;

    while (target instanceof Element && !matches(target, selector)) {
      target = target.parentNode as HTMLElement;
    }

    if (target instanceof Element && (handler.call(target, event) === false)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}
