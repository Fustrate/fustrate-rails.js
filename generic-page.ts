import set from 'lodash/set';

import { callDecoratedMethods, decorateMethod } from './decorators';
import { delegate } from './events';

interface UIElements {
  [s: string]: HTMLElement | UIElements | UIElements[];
}

const $refresh = Symbol('$refresh');
const $initialize = Symbol('$initialize');

export const button = (buttonName: string) => decorateMethod(`$onclick-${buttonName}`);

export const onChange = (fieldName: string) => decorateMethod(`$onchange-${fieldName}`);

export const onDoubleClick = (buttonName: string) => decorateMethod(`$ondoubleclick-${buttonName}`);

export const onClick = (name: string) => decorateMethod(`$onclick-${name}`);

export const initialize = decorateMethod($initialize);

export const refresh = decorateMethod($refresh);

export default class GenericPage {
  protected fields: UIElements;
  protected buttons: UIElements;

  public async initialize(): Promise<any> {
    // Always call this function first, because decorated functions might use fields/buttons.
    this.reloadUIElements();

    this.addEventListeners();

    callDecoratedMethods(this, $initialize);
  }

  protected addEventListeners(): void {
    delegate(
      document,
      { selector: '[data-button], [data-field]', exclude: '.modal [data-button], .modal [data-field]' },
      'click',
      (event) => {
        const element = event.target.closest<HTMLElement>('[data-button], [data-field]');

        if (element) {
          callDecoratedMethods(this, `$onclick-${element.dataset.button ?? element.dataset.field}`, event);
        }
      },
    );

    delegate(document, { selector: '[data-target]', exclude: '.modal [data-target]' }, 'click', (event) => {
      const element = event.target.closest<HTMLElement>('[data-target]');

      if (element) {
        callDecoratedMethods(this, `$onclick-${element.dataset.target}`, event);
      }
    });

    delegate(document, { selector: '[data-field]', exclude: '.modal [data-field]' }, 'dblclick', (event) => {
      const element = event.target.closest<HTMLElement>('[data-field]');

      if (element) {
        callDecoratedMethods(this, `$ondoubleclick-${element.dataset.field}`, event);
      }
    });

    delegate(document, { selector: '[data-field]', exclude: '.modal [data-field]' }, 'change', (event) => {
      const element = event.target.closest<HTMLElement>('[data-field]');

      if (element) {
        callDecoratedMethods(this, `$onchange-${element.dataset.field}`, event);
      }
    });
  }

  public refresh(): void {
    callDecoratedMethods(this, $refresh);
  }

  protected reloadUIElements(): void {
    this.fields = {};
    this.buttons = {};

    for (const element of document.body.querySelectorAll<HTMLElement>('[data-field]')) {
      if (!element.matches('.modal [data-field]') && element.dataset.field) {
        set(this.fields, element.dataset.field, element);
      }
    }

    for (const element of document.body.querySelectorAll<HTMLElement>('[data-button]')) {
      if (!element.matches('.modal [data-button]') && element.dataset.button) {
        set(this.buttons, element.dataset.button, element);
      }
    }
  }
}
