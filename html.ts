import escape from 'lodash/escape';
import kebabCase from 'lodash/kebabCase';

type ToggleableAttribute = 'checked' | 'required' | 'disabled' | 'selected' | 'readonly';

interface TagOptions {
  attributes?: Record<string, string | number | true>;
  children?: Node | (string | Node)[];
  class?: string | string[];
  data?: Record<string, string | number | true>;
  html?: string;
  text?: string;
}

function textElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: TagOptions,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (options) {
    if (options.html) {
      element.innerHTML = options.html;
    } else if (options.text) {
      element.textContent = options.text;
    } else if (options.children) {
      if (Array.isArray(options.children)) {
        element.append(...options.children.filter(Boolean));
      } else {
        element.append(options.children);
      }
    }

    if (options.class) {
      element.classList.add(...(typeof options.class === 'string' ? [options.class] : options.class));
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value === true ? '' : String(value));
      });
    }

    if (options.data) {
      Object.entries(options.data).forEach(([key, value]) => {
        element.setAttribute(`data-${kebabCase(key)}`, value === true ? '' : String(value));
      });
    }
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

// Access tag helpers via `tag.div({ ... })`
export const tag = {
  a: (options?: TagOptions) => textElement('a', options),
  button: (options?: TagOptions) => textElement('button', options),
  canvas: (options?: TagOptions) => textElement('canvas', options),
  dd: (options?: TagOptions) => textElement('dd', options),
  del: (options?: TagOptions) => textElement('del', options),
  div: (options?: TagOptions) => textElement('div', options),
  dl: (options?: TagOptions) => textElement('dl', options),
  dt: (options?: TagOptions) => textElement('dt', options),
  em: (options?: TagOptions) => textElement('em', options),
  h1: (options?: TagOptions) => textElement('h1', options),
  h2: (options?: TagOptions) => textElement('h2', options),
  h3: (options?: TagOptions) => textElement('h3', options),
  h4: (options?: TagOptions) => textElement('h4', options),
  h5: (options?: TagOptions) => textElement('h5', options),
  h6: (options?: TagOptions) => textElement('h6', options),
  i: (options?: TagOptions) => textElement('i', options),
  img: (options?: TagOptions) => textElement('img', options),
  input: (options?: TagOptions) => textElement('input', options),
  ins: (options?: TagOptions) => textElement('ins', options),
  label: (options?: TagOptions) => textElement('label', options),
  li: (options?: TagOptions) => textElement('li', options),
  optgroup: (options?: TagOptions) => textElement('optgroup', options),
  option: (options?: TagOptions) => textElement('option', options),
  p: (options?: TagOptions) => textElement('p', options),
  section: (options?: TagOptions) => textElement('section', options),
  select: (options?: TagOptions) => textElement('select', options),
  span: (options?: TagOptions) => textElement('span', options),
  strong: (options?: TagOptions) => textElement('strong', options),
  table: (options?: TagOptions) => textElement('table', options),
  tbody: (options?: TagOptions) => textElement('tbody', options),
  td: (options?: TagOptions) => textElement('td', options),
  textarea: (options?: TagOptions) => textElement('textarea', options),
  tr: (options?: TagOptions) => textElement('tr', options),
  ul: (options?: TagOptions) => textElement('ul', options),
};

export function stripHTML(html: string): string {
  const div = tag.div({ html });

  const { textContent } = div;

  div.remove();

  return textContent ?? '';
}
