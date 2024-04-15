import escape from 'lodash/escape';
import kebabCase from 'lodash/kebabCase';

type ToggleableAttribute = 'checked' | 'required' | 'disabled' | 'selected' | 'readonly';

interface BaseTagOptions {
  attributes?: Record<string, string | number | true>;
  class?: string | string[];
  data?: Record<string, string | number | true>;
}

interface ContentTagOptions extends BaseTagOptions {
  children?: Node | (string | Node)[];
  html?: string;
  text?: string;
}

function setBaseOptions(element: HTMLElement, options: BaseTagOptions): void {
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

function selfClosingElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: ContentTagOptions,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (options) {
    setBaseOptions(element, options);
  }

  return element;
}

function contentElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: ContentTagOptions,
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

    setBaseOptions(element, options);
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
  a: (options?: ContentTagOptions) => contentElement('a', options),
  br: () => selfClosingElement('br'),
  button: (options?: ContentTagOptions) => contentElement('button', options),
  canvas: (options?: ContentTagOptions) => contentElement('canvas', options),
  dd: (options?: ContentTagOptions) => contentElement('dd', options),
  del: (options?: ContentTagOptions) => contentElement('del', options),
  div: (options?: ContentTagOptions) => contentElement('div', options),
  dl: (options?: ContentTagOptions) => contentElement('dl', options),
  dt: (options?: ContentTagOptions) => contentElement('dt', options),
  em: (options?: ContentTagOptions) => contentElement('em', options),
  h1: (options?: ContentTagOptions) => contentElement('h1', options),
  h2: (options?: ContentTagOptions) => contentElement('h2', options),
  h3: (options?: ContentTagOptions) => contentElement('h3', options),
  h4: (options?: ContentTagOptions) => contentElement('h4', options),
  h5: (options?: ContentTagOptions) => contentElement('h5', options),
  h6: (options?: ContentTagOptions) => contentElement('h6', options),
  i: (options?: ContentTagOptions) => contentElement('i', options),
  img: (options?: ContentTagOptions) => contentElement('img', options),
  input: (options?: ContentTagOptions) => contentElement('input', options),
  ins: (options?: ContentTagOptions) => contentElement('ins', options),
  label: (options?: ContentTagOptions) => contentElement('label', options),
  li: (options?: ContentTagOptions) => contentElement('li', options),
  optgroup: (options?: ContentTagOptions) => contentElement('optgroup', options),
  option: (options?: ContentTagOptions) => contentElement('option', options),
  p: (options?: ContentTagOptions) => contentElement('p', options),
  section: (options?: ContentTagOptions) => contentElement('section', options),
  select: (options?: ContentTagOptions) => contentElement('select', options),
  span: (options?: ContentTagOptions) => contentElement('span', options),
  strong: (options?: ContentTagOptions) => contentElement('strong', options),
  table: (options?: ContentTagOptions) => contentElement('table', options),
  tbody: (options?: ContentTagOptions) => contentElement('tbody', options),
  td: (options?: ContentTagOptions) => contentElement('td', options),
  textarea: (options?: ContentTagOptions) => contentElement('textarea', options),
  tr: (options?: ContentTagOptions) => contentElement('tr', options),
  ul: (options?: ContentTagOptions) => contentElement('ul', options),
};

export function stripHTML(html: string): string {
  const div = tag.div({ html });

  const { textContent } = div;

  div.remove();

  return textContent ?? '';
}
