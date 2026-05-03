import { delegate, fire, stopEverything } from '../events';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('fire', () => {
  it('dispatches a custom event on the target and returns true', () => {
    const element = document.createElement('div');
    let detail: string | undefined;

    element.addEventListener('greet', (event: Event) => {
      detail = (event as CustomEvent).detail;
    });

    const result = fire(element, 'greet', 'hello');

    expect(result).toBe(true);
    expect(detail).toBe('hello');
  });

  it('returns false when the event default is prevented', () => {
    const element = document.createElement('div');

    element.addEventListener('greet', (event: Event) => {
      event.preventDefault();
    });

    const result = fire(element, 'greet');

    expect(result).toBe(false);
  });

  it('dispatches with bubbles and cancelable set to true', () => {
    const element = document.createElement('div');
    let capturedEvent: CustomEvent | undefined;

    element.addEventListener('greet', (event: Event) => {
      capturedEvent = event as CustomEvent;
    });

    fire(element, 'greet');

    expect(capturedEvent?.bubbles).toBe(true);
    expect(capturedEvent?.cancelable).toBe(true);
  });
});

describe('stopEverything', () => {
  it('prevents the event default', () => {
    const element = document.createElement('button');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    element.addEventListener('click', (e) => stopEverything(e));
    element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('stops propagation to the parent element', () => {
    const parent = document.createElement('div');
    const child = document.createElement('button');
    parent.append(child);
    let parentCalled = false;

    child.addEventListener('click', (e) => stopEverything(e));
    parent.addEventListener('click', () => {
      parentCalled = true;
    });

    child.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(parentCalled).toBe(false);
  });

  it('stops immediate propagation on the same element', () => {
    const element = document.createElement('button');
    let secondCalled = false;

    element.addEventListener('click', (e) => stopEverything(e));
    element.addEventListener('click', () => {
      secondCalled = true;
    });

    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(secondCalled).toBe(false);
  });
});

describe('delegate', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('calls the handler when a matching element is clicked', () => {
    const button = document.createElement('button');
    button.classList.add('action');
    container.append(button);

    const handler = vi.fn();
    delegate(document, 'button.action', 'click', handler);

    button.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('traverses up the DOM to find a matching ancestor', () => {
    const button = document.createElement('button');
    button.classList.add('action');
    const span = document.createElement('span');
    span.textContent = 'Click me';
    button.append(span);
    container.append(button);

    const handler = vi.fn();
    delegate(document, 'button.action', 'click', handler);

    span.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call the handler when the element does not match the selector', () => {
    const div = document.createElement('div');
    div.classList.add('other');
    container.append(div);

    const handler = vi.fn();
    delegate(document, 'button.action', 'click', handler);

    div.click();

    expect(handler).not.toHaveBeenCalled();
  });

  it('does not call the handler for excluded elements', () => {
    const button = document.createElement('button');
    button.classList.add('action');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const modalButton = document.createElement('button');
    modalButton.classList.add('action');
    modal.append(modalButton);
    container.append(button, modal);

    const handler = vi.fn();
    delegate(document, { selector: 'button.action', exclude: '.modal button.action' }, 'click', handler);

    modalButton.click();
    expect(handler).not.toHaveBeenCalled();

    button.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('prevents default and stops propagation when the handler returns false', () => {
    const button = document.createElement('button');
    button.classList.add('action');
    container.append(button);

    delegate(container, 'button.action', 'click', () => false);

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('returns a cleanup function that removes the event listener', () => {
    const button = document.createElement('button');

    button.classList.add('action');

    container.append(button);

    const handler = vi.fn();

    const cleanup = delegate(container, 'button.action', 'click', handler);

    button.click();

    expect(handler).toHaveBeenCalledTimes(1);

    cleanup();

    button.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('cleanup function does not affect other listeners on the same element', () => {
    const button = document.createElement('button');
    button.classList.add('action');
    container.append(button);

    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const cleanup1 = delegate(container, 'button.action', 'click', handler1);

    delegate(container, 'button.action', 'click', handler2);

    cleanup1();

    button.click();

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);
  });
});
