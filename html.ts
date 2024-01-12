type ToggleableAttribute = 'checked' | 'required' | 'disabled' | 'selected' | 'readonly';

interface TagOptions {
  class?: string | string[];
  html?: boolean;
}

export function cloneTemplate<T = HTMLElement>(selector: string): T {
  return document.querySelector<HTMLTemplateElement>(selector)?.content?.firstElementChild?.cloneNode(true) as T;
}

export function setChildren(parent: HTMLElement, items: HTMLElement[]): void {
  const fragment = document.createDocumentFragment();

  fragment.append(...items);

  parent.textContent = '';
  parent.append(fragment);
}

export function toggleAttribute(field: HTMLElement, attribute: ToggleableAttribute, enabled: boolean): void {
  if (enabled) {
    field.setAttribute(attribute, attribute);
  } else {
    field.removeAttribute(attribute);
  }
}

function textElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text: string,
  opts?: TagOptions,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (opts?.html) {
    element.innerHTML = text;
  } else {
    element.textContent = text;
  }

  if (opts?.class) {
    element.classList.add(...(typeof opts.class === 'string' ? [opts.class] : opts.class));
  }

  return element;
}

// Access tag helpers via `tag.div('text content')`
export const tag = {
  div: (text: string, opts?: TagOptions) => textElement('div', text, opts),
  p: (text: string, opts?: TagOptions) => textElement('p', text, opts),
  span: (text: string, opts?: TagOptions) => textElement('span', text, opts),
};

export function stripHTML(html: string): string {
  const div = tag.div(html, { html: true });

  const { textContent } = div;

  div.remove();

  return textContent ?? '';
}
