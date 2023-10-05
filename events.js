// Checks if the given native dom element matches the selector
function matches(element, selector) {
  return typeof selector === 'string'
    ? element.matches(selector)
    : element.matches(selector.selector) && !element.matches(selector.exclude);
}

// Triggers a custom event on an element and returns false if the event result is false
export function fire(target, name, detail) {
  const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail });

  target.dispatchEvent(event);

  return !event.defaultPrevented;
}

// Helper function, needed to provide consistent behavior in IE
export function stopEverything(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

// Delegates events to a specified parent `element`, which fires event `handler` for the specified
// `selector` when an event of `eventType` is triggered.
export function delegate(element, selector, eventType, handler) {
  element.addEventListener(eventType, (event) => {
    let { target } = event;

    while (!!(target instanceof Element) && !matches(target, selector)) {
      target = target.parentNode;
    }

    if (target instanceof Element && (handler.call(target, event) === false)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}
