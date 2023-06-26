import set from 'lodash/set';
import { delegate } from '@rails/ujs';

import { callDecoratedMethods, decorateMethod } from './decorators';

export const button = (buttonName) => decorateMethod(`$onclick-${buttonName}`);

export const onChange = (fieldName) => decorateMethod(`$onchange-${fieldName}`);

export const onDoubleClick = (buttonName) => decorateMethod(`$ondoubleclick-${buttonName}`);

export const onClick = (name) => decorateMethod(`$onclick-${name}`);

export const refresh = decorateMethod('$refresh');

export default class GenericPage {
  initialize() {
    this.reloadUIElements();

    this.addEventListeners();

    return Promise.resolve();
  }

  addEventListeners() {
    delegate(document, '[data-button], [data-field]', 'click', (event) => {
      const element = event.target.closest('[data-button], [data-field]');

      callDecoratedMethods(this, `$onclick-${element.dataset.button || element.dataset.field}`);
    });

    delegate(document, '[data-target]', 'click', (event) => {
      callDecoratedMethods(this, `$onclick-${event.target.closest('[data-target]').dataset.target}`);
    });

    delegate(document, '[data-field]', 'dblclick', (element) => {
      callDecoratedMethods(this, `$ondoubleclick-${element.target.closest('[data-field]').dataset.button}`);
    });

    delegate(document, '[data-field]', 'change', (element) => {
      callDecoratedMethods(this, `$onchange-${element.target.closest('[data-field]').dataset.field}`);
    });
  }

  refresh() {
    callDecoratedMethods(this, '$refresh');
  }

  reloadUIElements() {
    this.fields = {};
    this.buttons = {};

    Array.from(document.body.querySelectorAll('[data-field]'))
      .filter((element) => !element.matches('.modal [data-field]'))
      .forEach((element) => {
        set(this.fields, element.dataset.field, element);
      });

    Array.from(document.body.querySelectorAll('[data-button]'))
      .filter((element) => !element.matches('.modal [data-button]'))
      .forEach((element) => {
        set(this.buttons, element.dataset.button, element);
      });
  }

  setHeader(text) {
    document.body.querySelector('.header .title').textContent = text;
  }
}
