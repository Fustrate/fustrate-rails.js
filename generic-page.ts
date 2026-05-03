import { merge } from 'es-toolkit/object';

import { callDecoratedMethods, decorateMethod } from './decorators';
import { delegate } from './events';
import { objectFromPath } from './object';

interface UIElements {
  [s: string]: HTMLElement | UIElements | UIElements[];
}

const $initialize = Symbol('$initialize');
const $refresh = Symbol('$refresh');

export const button = (buttonName: string) => decorateMethod(`$onclick-${buttonName}`);

export const initialize = decorateMethod($initialize);

export const onChange = (fieldName: string) => decorateMethod(`$onchange-${fieldName}`);

export const onClick = (name: string) => decorateMethod(`$onclick-${name}`);

export const onDoubleClick = (buttonName: string) => decorateMethod(`$ondoubleclick-${buttonName}`);

export const refresh = decorateMethod($refresh);

export default class GenericPage {
  protected fields: UIElements;
  protected buttons: UIElements;

  public async initialize(): Promise<any> {
    // Always call this function first, because decorated functions might use fields/buttons.
    this.reloadUIElements();

    this.addDecoratedEventHandlers();

    callDecoratedMethods(this, $initialize);
  }

  protected addDecoratedEventHandlers(): void {
    delegate(
      document,
      {
        selector: '[data-button], [data-field]',
        exclude: '.modal [data-button], .modal [data-field]',
      },
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
        merge(this.fields, objectFromPath(element.dataset.field, element));
      }
    }

    for (const element of document.body.querySelectorAll<HTMLElement>('[data-button]')) {
      if (!element.matches('.modal [data-button]') && element.dataset.button) {
        merge(this.buttons, objectFromPath(element.dataset.button, element));
      }
    }
  }
}
