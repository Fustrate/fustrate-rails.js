import type Listenable from './listenable';

interface MatchesOptions {
  selector: string;
  exclude: string;
}

// Checks if the given native dom element matches the selector
function matches(element: Element, selector: string | MatchesOptions) {
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

export type HTMLEvent<T = HTMLElement> = UIEvent & { target: T };

export function delegate<T = HTMLEvent>(
  element: Element | Document | DocumentFragment,
  selector: string | MatchesOptions,
  eventType: string,
  handler: (evt: T) => any,
): void {
  element.addEventListener(eventType, (event: any) => {
    let { target } = event;

    while (target instanceof Element && !matches(target, selector)) {
      target = target.parentNode;
    }

    if (target instanceof Element && (handler.call(target, event) === false)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}
