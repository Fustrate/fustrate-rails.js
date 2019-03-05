import $ from 'jquery';

import Component from '../component';
import { escapeHTML, icon as createIcon, triggerEvent } from '../utilities';

const defaultSettings = {
  size: 'tiny',
  type: null,
  icon: undefined,
  content: undefined,
  title: null,
  buttons: [],
  fadeSpeed: 250,
  distanceFromTop: 25,
  appendTo: 'body',
  css: {
    open: {
      opacity: 0,
      visibility: 'visible',
      display: 'block',
    },
    close: {
      opacity: 1,
      visibility: 'hidden',
      display: 'none',
    },
  },
};

const template = `
  <div class="modal">
    <div class="modal-title">
      <span></span>
      <a href="#" class="modal-close">&#215;</a>
    </div>
    <div class="modal-content"></div>
    <div class="modal-buttons"></div>
  </div>`;

class Modal extends Component {
  static get settings() { return {}; }

  constructor({ settings } = {}) {
    super();

    this.settings = Object.deepExtend(
      {},
      defaultSettings,
      this.constructor.settings != null ? this.constructor.settings : {},
      settings != null ? settings : {},
    );

    this.settings.previousModal = $();
    this.modal = this.createModal();

    this.setTitle(this.settings.title, { icon: this.settings.icon });
    this.setContent(this.settings.content, false);
    this.setButtons(this.settings.buttons, false);
    this.reloadUIElements();
    this.addEventListeners();
    this.initialize();

    this.modal.data('modal', this);
  }

  initialize() {} // eslint-disable-line class-methods-use-this

  reloadUIElements() {
    this.fields = {};
    this.buttons = {};

    this.modal[0].querySelectorAll('[data-field]').forEach((element) => {
      this.fields[element.dataset.field] = element;
    });

    this.modal[0].querySelectorAll('[data-button]').forEach((element) => {
      this.buttons[element.dataset.button] = element;
    });
  }

  setTitle(title, { icon } = {}) {
    const iconToUse = icon !== false && icon == null ? this.constructor.icon : icon;

    this.modal[0].querySelector('.modal-title span')
      .innerHTML = iconToUse ? `${createIcon(iconToUse)} ${title}` : title;
  }

  setContent(content, reload = true) {
    let modalContent = content;

    if (typeof content === 'function') {
      modalContent = modalContent();
    }

    this.modal[0].querySelector('.modal-content').innerHTML = modalContent;

    this.settings.cachedHeight = undefined;

    if (reload) {
      this.reloadUIElements();
    }
  }

  setButtons(buttons, reload = true) {
    if (buttons == null || buttons.length < 1) {
      this.modal[0].querySelector('.modal-buttons').innerHTML = '';

      return;
    }

    const list = [];

    buttons.forEach((button) => {
      if (typeof button === 'string') {
        list.push(`
          <button data-button="${button}" class="${button} expand">
            ${button.titleize()}
          </button>`);
      } else if (typeof button === 'object') {
        Object.keys(button).forEach((name) => {
          list.push(this.constructor.createButton(name, button[name]));
        }, this);
      }
    }, this);

    const klass = `large-${12 / list.length}`;
    const columns = list.map(element => `<div class="columns ${klass}">${element}</div>`);

    this.modal[0].querySelector('.modal-buttons').innerHTML = `<div class="row">${columns.join('')}</div>`;

    this.settings.cachedHeight = undefined;

    if (reload) {
      this.reloadUIElements();
    }
  }

  static createButton(name, options) {
    let text;
    let type;

    if (typeof options === 'object') {
      ({ text, type } = options);
    } else if (typeof options === 'string') {
      text = options;
    }

    if (text == null) {
      text = name.titleize();
    }

    if (type == null) {
      type = name;
    }

    return `
      <button data-button="${name}" class="expand ${type}">
        ${escapeHTML(text)}
      </button>`;
  }

  addEventListeners() {
    this.modal
      .off('.modal')
      .on('close.modal', this.close.bind(this))
      .on('open.modal', this.open.bind(this))
      .on('hide.modal', this.hide.bind(this))
      .on('opened.modal', this.focusFirstInput.bind(this))
      .on('click.modal', '.modal-close', this.closeButtonClicked.bind(this));

    $(document)
      .off('.modal', '.modal-overlay')
      .on('click.modal touchstart.modal', '.modal-overlay', this.constructor.backgroundClicked);

    if (this.buttons.cancel) {
      this.buttons.cancel.addEventListener('click', this.cancel.bind(this));
    }
  }

  focusFirstInput() {
    if (/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
      // Focus requires a slight physical scroll on iOS 8.4
      return;
    }

    $('input, select, textarea', this.modal)
      .filter(':visible:not(:disabled):not([readonly])')
      .first()
      .focus();
  }

  open() {
    if (this.modal[0].classList.contains('locked') || this.modal[0].classList.contains('open')) {
      return;
    }

    this.modal[0].classList.add('locked');


    // If there is currently a modal being shown, store it and re-open it when
    // this modal closes.
    this.settings.previousModal = $('.modal.open');

    // These events only matter when the modal is visible
    $('body').off('keyup.modal').on('keyup.modal', (e) => {
      if (this.modal[0].classList.contains('locked') || e.which !== 27) {
        return;
      }

      this.close();
    });

    this.modal.trigger('opening.modal');

    if (typeof this.settings.cachedHeight === 'undefined') {
      this.cacheHeight();
    }

    if (this.settings.previousModal.length) {
      this.settings.previousModal.trigger('hide.modal');
    } else {
      // There are no open modals - show the background overlay
      this.constructor.toggleBackground(true);
    }

    const css = this.settings.css.open;
    // css.top = parseInt @modal.css('top'), 10
    css.top = `${$(window).scrollTop() - this.settings.cachedHeight}px`;

    const endCss = {
      top: `${$(window).scrollTop() + this.settings.distanceFromTop}px`,
      opacity: 1,
    };

    setTimeout((() => {
      this.modal.css(css).addClass('open').animate(endCss, 250, 'linear', () => {
        this.modal.removeClass('locked').trigger('opened.modal');
      });
    }), 125);
  }

  close(openPrevious = true) {
    if (this.modal[0].classList.contains('locked') || !this.modal[0].classList.contains('open')) {
      return;
    }

    this.modal[0].classList.add('locked');

    $('body').off('keyup.modal');

    if (!(this.settings.previousModal.length && openPrevious)) {
      this.constructor.toggleBackground(false);
    }

    const endCss = {
      top: `${-$(window).scrollTop() - this.settings.cachedHeight}px`,
      opacity: 0,
    };

    setTimeout((() => {
      this.modal.animate(endCss, 250, 'linear', () => {
        this.modal
          .css(this.settings.css.close)
          .removeClass('locked')
          .trigger('closed.modal');
        if (openPrevious) {
          this.openPreviousModal();
        } else {
          this.settings.previousModal = $();
        }
      }).removeClass('open');
    }), 125);
  }

  // Just hide the modal immediately and don't bother with an overlay
  hide() {
    this.modal.removeClass('open locked').css(this.settings.css.close);
  }

  cancel() {
    // Reject any deferrals
    if (this.deferred != null) {
      this.deferred.reject();
    }

    return this.close();
  }

  openPreviousModal() {
    this.settings.previousModal.trigger('open.modal');

    this.settings.previousModal = $();
  }

  static get closeOnBackgroundClick() { return true; }

  cacheHeight() {
    this.settings.cachedHeight = this.modal.show().height();

    this.modal.hide();
  }

  createModal() {
    const classes = this.defaultClasses().join(' ');

    return $(template).addClass(classes).appendTo(this.settings.appendTo);
  }

  defaultClasses() {
    return [this.settings.size, this.settings.type].filter(klass => klass !== null);
  }

  static toggleBackground(visible = true) {
    if (!Modal.overlay) {
      Modal.overlay = $('<div class="modal-overlay">');
    }

    if (visible) {
      if (Modal.overlay.is(':visible')) {
        return;
      }

      Modal.overlay.hide().appendTo('body').fadeIn(Modal.fadeSpeed);
    } else {
      Modal.overlay.fadeOut(Modal.fadeSpeed, () => {
        Modal.overlay.detach();
      });
    }
  }

  static backgroundClicked() {
    const modal = $('.modal.open');

    if (!modal || modal.hasClass('locked')) {
      return false;
    }

    // Don't continue to close if we're not supposed to
    if (!modal.data('modal').constructor.closeOnBackgroundClick) {
      return false;
    }

    modal.trigger('close.modal');

    return false;
  }

  closeButtonClicked() {
    if (!this.modal[0].classList.contains('locked')) {
      this.modal.trigger('close.modal');
    }

    return false;
  }
}

export default Modal;
