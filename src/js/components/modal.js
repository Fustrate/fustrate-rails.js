import { escape, startCase } from 'lodash/string';
import { pull } from 'lodash/array';

import { delegate, fire, stopEverything } from '@rails/ujs';

import Component from '../component';
import { isVisible } from '../show_hide';
import {
  animate,
  elementFromString,
  icon as createIcon,
} from '../utilities';

const defaultSettings = {
  size: 'tiny',
  type: null,
  icon: undefined,
  content: undefined,
  title: null,
  buttons: [],
  distanceFromTop: 25,
};

const template = `
  <div class="modal" role="dialog" aria-modal="true">
    <div class="modal-title">
      <span></span>
      <a href="#" class="modal-close">&#215;</a>
    </div>
    <div class="modal-content"></div>
    <div class="modal-buttons"></div>
  </div>`;

// A stack of currently-open modals
let openModals = [];

// We only want to add the global listeners once
let addedGlobalListeners = false;

let overlay;

let modalCount = 0;

function createButton(name, options) {
  let text;
  let type;

  if (typeof options === 'object') {
    ({ text, type } = options);
  } else if (typeof options === 'string') {
    text = options;
  }

  return `
    <button data-button="${name}" class="${type || name}">
      ${escape(text || startCase(name))}
    </button>`;
}

function toggleOverlay(visible = true) {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('modal-overlay');
  }

  if (visible) {
    if (!isVisible(overlay)) {
      document.body.appendChild(overlay);

      animate(overlay, 'fadeIn', { speed: 'fast' });
    }
  } else {
    animate(overlay, 'fadeOut', { speed: 'faster' }, () => {
      overlay.parentNode.removeChild(overlay);
    });
  }
}

export default class Modal extends Component {
  static get settings() {
    return {};
  }

  constructor(settings = {}) {
    super();

    modalCount += 1;
    this.modalId = modalCount;

    this.settings = { ...defaultSettings, ...settings };

    this.modal = this.createModal();

    this.setTitle(this.settings.title, { icon: this.settings.icon });
    this.setContent(this.settings.content, false);
    this.setButtons(this.settings.buttons, false);
    this.reloadUIElements();
    this.addEventListeners();
    this.initialize();
  }

  initialize() { }

  reloadUIElements() {
    this.fields = {};
    this.buttons = {};

    this.modal.querySelectorAll('[data-field]').forEach((element) => {
      this.fields[element.dataset.field] = element;
    });

    this.modal.querySelectorAll('[data-button]').forEach((element) => {
      this.buttons[element.dataset.button] = element;
    });
  }

  setTitle(title, { icon } = {}) {
    const iconToUse = icon !== false && icon == null ? this.constructor.icon : icon;

    this.modal.querySelector('.modal-title span').innerHTML = iconToUse
      ? `${createIcon(iconToUse)} ${title}`
      : title;
  }

  setContent(content, reload = true) {
    let modalContent = content;

    if (typeof content === 'function') {
      modalContent = modalContent();
    }

    this.modal.querySelector('.modal-content').innerHTML = modalContent;

    if (reload) {
      this.reloadUIElements();
    }
  }

  setButtons(buttons, reload = true) {
    if (buttons == null || buttons.length < 1) {
      this.modal.querySelector('.modal-buttons').innerHTML = '';

      return;
    }

    const list = [];

    buttons.forEach((button) => {
      if (button === 'spacer') {
        list.push('<div class="spacer"></div>');
      } else if (typeof button === 'string') {
        list.push(`<button class="${button}" data-button="${button}">${startCase(button)}</button>`);
      } else if (typeof button === 'object') {
        Object.keys(button).forEach((name) => {
          list.push(createButton(name, button[name]));
        }, this);
      }
    }, this);

    this.modal.querySelector('.modal-buttons').innerHTML = list.join(' ');

    if (reload) {
      this.reloadUIElements();
    }
  }

  addEventListeners() {
    this.modal
      .querySelector('.modal-close')
      .addEventListener('click', this.closeButtonClicked.bind(this));

    if (!addedGlobalListeners) {
      delegate(document.body, '.modal-overlay', 'click', this.constructor.backgroundClicked);
      delegate(document.body, '.modal-overlay', 'touchstart', this.constructor.backgroundClicked);
      document.body.addEventListener('keyup', this.constructor.keyPressed);

      addedGlobalListeners = true;
    }

    if (this.buttons.cancel) {
      this.buttons.cancel.addEventListener('click', this.cancel.bind(this));
    }
  }

  focusFirstInput() {
    if (/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
      // Focus requires a slight physical scroll on iOS 8.4
      return;
    }

    const [firstInput] = Array.from(this.modal.querySelectorAll('input, select, textarea'))
      .filter((element) => isVisible(element) && !element.disabled && !element.readOnly);

    if (firstInput) {
      firstInput.focus();
    }
  }

  open() {
    if (this.locked || this.modal.classList.contains('open')) {
      return;
    }

    this.locked = true;

    if (openModals.includes(this)) {
      pull(openModals, this);
    }

    openModals.push(this);

    fire(this.modal, 'modal:opening');

    if (openModals.length > 1) {
      // Hide the modal immediately previous to this one.
      openModals[openModals.length - 2].hide();
    } else {
      // There are no open modals - show the background overlay
      toggleOverlay(true);
    }

    const { top } = document.body.getBoundingClientRect();

    this.modal.style.top = `${-top + this.settings.distanceFromTop}px`;

    setTimeout(() => {
      this.modal.classList.add('open');

      animate(this.modal, 'fadeInDown', {}, () => {
        this.locked = false;

        fire(this.modal, 'modal:opened');

        this.focusFirstInput();
      });
    }, 125);
  }

  close(openPrevious = true) {
    if (this.locked || !this.modal.classList.contains('open')) {
      return;
    }

    this.locked = true;

    if (!openPrevious || openModals.length === 1) {
      toggleOverlay(false);
    }

    // Remove the top-most modal (this one) from the stack
    openModals.pop();

    setTimeout(() => {
      animate(this.modal, 'fadeOutUp', {}, () => {
        fire(this.modal, 'modal:closed');

        this.modal.classList.remove('open');

        this.locked = false;
      });

      if (openPrevious) {
        this.openPreviousModal();
      } else {
        this.constructor.hideAllModals();
      }
    }, 125);
  }

  // Just hide the modal immediately and don't bother with an overlay
  hide() {
    this.locked = false;

    this.modal.classList.remove('open');
  }

  cancel() {
    this.close();
  }

  openPreviousModal() {
    if (openModals.length > 0) {
      openModals[openModals.length - 1].open();
    }
  }

  createModal() {
    // Join and split in case any of the classes include spaces
    const classes = this.defaultClasses()
      .join(' ')
      .split(' ');

    const element = elementFromString(template);
    element.classList.add(...classes);

    // Accessibility
    element.setAttribute('aria-labelledby', `modal_${this.modalId}_title`);
    element.querySelector('.modal-title span').setAttribute('id', `modal_${this.modalId}_title`);

    document.body.appendChild(element);

    return element;
  }

  defaultClasses() {
    return [this.settings.size, this.settings.type].filter((klass) => klass != null);
  }

  closeButtonClicked(event) {
    stopEverything(event);

    this.close();

    return false;
  }

  static get closeOnBackgroundClick() {
    return true;
  }

  // Close the top-most modal if the background is clicked
  static backgroundClicked() {
    const modal = openModals[openModals.length - 1];

    // Don't continue to close if we're not supposed to
    if (modal && !modal.locked && modal.constructor.closeOnBackgroundClick) {
      modal.close();
    }

    return false;
  }

  static hideAllModals() {
    openModals.forEach((modal) => {
      modal.hide();
    });

    openModals = [];
  }

  static keyPressed(event) {
    if (event.which === 27 && openModals.length > 0) {
      openModals[openModals.length - 1].close();
    }
  }
}
