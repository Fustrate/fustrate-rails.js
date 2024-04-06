import escape from 'lodash/escape';

type ToggleableAttribute = 'checked' | 'required' | 'disabled' | 'selected' | 'readonly';

interface TagOptions {
  class?: string | string[];
  html?: string;
  text?: string;
  children?: HTMLElement[];
  data?: Record<string, string>;
}

export function setChildren(parent: HTMLElement, items: HTMLElement[]): void {
  const fragment = document.createDocumentFragment();

  fragment.append(...items);

  parent.textContent = '';
  parent.append(fragment);
}

function textElement<K extends keyof HTMLElementTagNameMap>(tag: K, options?: TagOptions): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (options?.html) {
    element.innerHTML = options.html;
  } else if (options?.text) {
    element.textContent = options.text;
  } else if (options?.children) {
    setChildren(element, options.children);
  }

  if (options?.class) {
    element.classList.add(...(typeof options.class === 'string' ? [options.class] : options.class));
  }

  if (options?.data) {
    Object.entries(options.data).forEach(([key, value]) => {
      element.setAttribute(`data-${key}`, value);
    });
  }

  return element;
}

export function cloneTemplate<T = HTMLElement>(selector: string): T {
  return document.querySelector<HTMLTemplateElement>(selector)?.content?.firstElementChild?.cloneNode(true) as T;
}

export function elementFromString<T extends HTMLElement>(string: string): T {
  const template = document.createElement('template');

  template.innerHTML = string.trim();

  return template.content.firstChild as T;
}

export function escapeMultilineHTML(string: string | null | undefined): string {
  if (string == null) {
    return '';
  }

  return String(string)
    .split(/\r?\n/)
    .map((line) => escape(line))
    .join('<br />');
}

export function toggleAttribute(field: HTMLElement, attribute: ToggleableAttribute, enabled: boolean): void {
  if (enabled) {
    field.setAttribute(attribute, attribute);
  } else {
    field.removeAttribute(attribute);
  }
}

// Access tag helpers via `tag.div({ ... })`
export const tag = {
  a: (options?: TagOptions) => textElement('a', options),
  dd: (options?: TagOptions) => textElement('dd', options),
  div: (options?: TagOptions) => textElement('div', options),
  dt: (options?: TagOptions) => textElement('dt', options),
  img: (options?: TagOptions) => textElement('img', options),
  li: (options?: TagOptions) => textElement('li', options),
  option: (options?: TagOptions) => textElement('option', options),
  p: (options?: TagOptions) => textElement('p', options),
  section: (options?: TagOptions) => textElement('section', options),
  span: (options?: TagOptions) => textElement('span', options),
  tbody: (options?: TagOptions) => textElement('tbody', options),
  td: (options?: TagOptions) => textElement('td', options),
  tr: (options?: TagOptions) => textElement('tr', options),
  ul: (options?: TagOptions) => textElement('ul', options),
};

export function stripHTML(html: string): string {
  const div = tag.div({ html });

  const { textContent } = div;

  div.remove();

  return textContent ?? '';
}
