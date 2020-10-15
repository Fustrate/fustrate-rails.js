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
        this.fields[element.dataset.field] = element;
      });

    Array.from(document.body.querySelectorAll('[data-button]'))
      .filter((element) => !element.matches('.modal [data-button]'))
      .forEach((element) => {
        this.buttons[element.dataset.button] = element;
      });
  }

  setHeader(text) {
    document.body.querySelector('.header .title').textContent = text;
  }

  refresh() {
    this.callAllMethodsBeginningWith('refresh');
  }

  callAllMethodsBeginningWith(string) {
    if (!this.allMethodNamesList) {
      this.allMethodNamesList = this.getAllMethodNames();
    }

    this.allMethodNamesList.forEach((name) => {
      if (name !== string && name.indexOf(string) === 0) {
        this[name].apply(this);
      }
    });
  }

  getAllMethodNames() {
    let props = [];
    let klass = this;

    while (klass) {
      props = props.concat(Object.getOwnPropertyNames(klass));

      klass = Object.getPrototypeOf(klass);
    }

    return props.sort().filter((name) => typeof this[name] === 'function');
  }
}
