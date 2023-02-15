import set from 'lodash/set';

function makeDecorator(tag) {
  return (target, key, descriptor) => {
    descriptor.value[tag] = true;
  };
}

export function decorateMethod(tag) {
  return makeDecorator(tag);
}

export function callDecoratedMethods(obj, tag) {
  const descriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj));

  Object.entries(descriptors).forEach(([name, descriptor]) => {
    if (descriptor.value && descriptor.value[tag]) {
      obj[name]();
    }
  });
}

export default class GenericPage {
  initialize() {
    this.reloadUIElements();

    this.addEventListeners();

    return Promise.resolve();
  }

  addEventListeners() {
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

  refresh() { }
}
