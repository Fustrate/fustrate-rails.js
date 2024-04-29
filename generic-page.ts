import set from 'lodash/set';

import { callDecoratedMethods, decorateMethod } from './decorators';
import { delegate } from './events';

interface UIElements {
  [s: string]: HTMLElement | UIElements | UIElements[];
}

const $refresh = Symbol('$refresh');

export const button = (buttonName: string) => decorateMethod(`$onclick-${buttonName}`);

export const onChange = (fieldName: string) => decorateMethod(`$onchange-${fieldName}`);

export const onDoubleClick = (buttonName: string) => decorateMethod(`$ondoubleclick-${buttonName}`);

export const onClick = (name: string) => decorateMethod(`$onclick-${name}`);

export const refresh = decorateMethod($refresh);

export default class GenericPage {
  protected fields: UIElements;
  protected buttons: UIElements;

  public async initialize(): Promise<any> {
    this.reloadUIElements();

    this.addEventListeners();
  }

  protected addEventListeners(): void {
    delegate(
      document,
      { selector: '[data-button], [data-field]', exclude: '.modal [data-button], .modal [data-field]' },
      'click',
      (event) => {
        const element = event.target.closest<HTMLElement>('[data-button], [data-field]');

        if (element) {
          callDecoratedMethods(this, `$onclick-${element.dataset.button! || element.dataset.field!}`, event);
        }
      },
    );

    delegate(document, { selector: '[data-target]', exclude: '.modal [data-target]' }, 'click', (event) => {
      callDecoratedMethods(this, `$onclick-${event.target.closest<HTMLElement>('[data-target]')!.dataset.target}`, event);
    });

    delegate(document, { selector: '[data-field]', exclude: '.modal [data-field]' }, 'dblclick', (event) => {
      callDecoratedMethods(this, `$ondoubleclick-${event.target.closest<HTMLElement>('[data-field]')!.dataset.field}`, event);
    });

    delegate(document, { selector: '[data-field]', exclude: '.modal [data-field]' }, 'change', (event) => {
      callDecoratedMethods(this, `$onchange-${event.target.closest<HTMLElement>('[data-field]')!.dataset.field}`, event);
    });
  }

  public refresh(): void {
    callDecoratedMethods(this, $refresh);
  }

  protected reloadUIElements(): void {
    this.fields = {};
    this.buttons = {};

    [...document.body.querySelectorAll<HTMLElement>('[data-field]')]
      .filter((element) => !element.matches('.modal [data-field]'))
      .forEach((element) => {
        set(this.fields, element.dataset.field!, element);
      });

    [...document.body.querySelectorAll<HTMLElement>('[data-button]')]
      .filter((element) => !element.matches('.modal [data-button]'))
      .forEach((element) => {
        set(this.buttons, element.dataset.button!, element);
      });
  }
}
