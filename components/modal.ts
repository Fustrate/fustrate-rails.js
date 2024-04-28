import escape from 'lodash/escape';
import pull from 'lodash/pull';
import set from 'lodash/set';
import startCase from 'lodash/startCase';

import { delegate, fire, stopEverything } from '../events';
import { elementFromString, tag } from '../html';
import Listenable from '../listenable';
import { isVisible } from '../show-hide';
import { animate, icon as createIcon } from '../utilities';

import '../array-at-polyfill';

export interface UIElements {
  [s: string]: HTMLElement | UIElements | UIElements[];
}

interface ButtonAttributes {
  text?: string;
  type?: string;
}

export type ModalButton = 'spacer' | 'cancel' | 'save' | Record<string, string | ButtonAttributes>;

export type ModalContent = string |
  HTMLElement |
  HTMLElement[] |
  (() => HTMLElement | HTMLElement[]) |
  DocumentFragment;

export interface ModalSettings {
  buttons?: ModalButton[];
  closeOnBackgroundClick?: boolean;
  distanceFromTop?: number;
  icon?: string;
  size?: string;
  template?: ModalContent;
  title?: string;
  type?: string;
}

export const defaultSettings: Partial<ModalSettings> = {
  buttons: [],
  closeOnBackgroundClick: true,
  distanceFromTop: 25,
  size: 'tiny',
};

export function settings(settings: Partial<ModalSettings>): ClassDecorator {
  return (target) => {
    Object.defineProperty(target, 'settings', {
      configurable: false,
      enumerable: true,
      value: settings,
      writable: false,
    });
  };
}

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
let openModals: Modal<any>[] = [];

// We only want to add the global listeners once
let addedGlobalListeners = false;

let overlay: HTMLDivElement;

let modalCount = 0;

let onMouseMove: any;
let onMouseUp: any;

const dragState = {
  mouseDownX: 0,
  mouseDownY: 0,
  xOffset: 0,
  yOffset: 0,
};

function createButton(name: string, options?: string | ButtonAttributes) {
  let text: string | undefined;
  let type: string | undefined;

  if (typeof options === 'object') {
    ({ text, type } = options);
  } else if (typeof options === 'string') {
    text = options;
  }

  return `
    <button data-button="${name}" class="${type ?? name}">
      ${escape(text ?? startCase(name))}
    </button>`;
}

function toggleOverlay(visible = true) {
  if (!overlay) {
    overlay = tag.div({ class: 'modal-overlay' });
  }

  if (visible) {
    if (!isVisible(overlay)) {
      document.body.append(overlay);

      animate(overlay, 'fadeIn', { speed: 'fast' });
    }
  } else {
    animate(overlay, 'fadeOut', { speed: 'faster' }, () => {
      overlay.remove();
    });
  }
}

function openPreviousModal() {
  openModals.at(-1)?.open(true);
}

function hideAllModals() {
  openModals.forEach((modal) => {
    modal.hide();
  });

  openModals = [];
}

// Close the top-most modal if the background is clicked
function backgroundClicked() {
  const modal = openModals.at(-1);

  // Don't continue to close if we're not supposed to
  if (modal && !modal.locked && modal.setting('closeOnBackgroundClick') !== false) {
    modal.close();
  }

  return false;
}

function keyPressed(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    openModals.at(-1)?.close();
  }
}

function addGlobalListeners() {
  if (addedGlobalListeners) {
    return;
  }

  delegate(document.body, '.modal-overlay', 'click', backgroundClicked);
  delegate(document.body, '.modal-overlay', 'touchstart', backgroundClicked);
  document.body.addEventListener('keyup', keyPressed);

  addedGlobalListeners = true;
}

export default abstract class Modal<T = void> extends Listenable {
  #locked: boolean;

  protected static defaultSettings: ModalSettings;
  protected static settings: Partial<ModalSettings>;

  protected buttons: UIElements;
  protected fields: UIElements;
  protected modalId: number;
  protected modal: HTMLDivElement;

  protected promise: Promise<T>;
  protected resolve: (value: T | PromiseLike<T>) => void;
  protected reject: (reason?: any) => void;

  protected settings: ModalSettings;

  public constructor() {
    super();

    this.settings = {
      ...(Object.getPrototypeOf(this).constructor as typeof Modal).defaultSettings,
      ...(Object.getPrototypeOf(this).constructor as typeof Modal).settings,
    };

    this.setup();
  }

  public get locked() { return this.#locked; }

  public setting<K extends keyof ModalSettings>(key: K): Partial<ModalSettings>[K] {
    return this.settings[key] ?? defaultSettings[key];
  }

  protected setup() {
    modalCount += 1;
    this.modalId = modalCount;

    this.modal = this.createModal();

    const icon = this.setting('icon');

    this.setTitle(this.setting('title') ?? '', icon == null ? undefined : { icon });
    this.setContent(this.setting('template') ?? '', false);
    this.setButtons(this.setting('buttons') ?? [], false);
    this.reloadUIElements();
    this.addEventListeners();
  }

  protected reloadUIElements(): void {
    this.fields = {};
    this.buttons = {};

    this.modal.querySelectorAll<HTMLElement>('[data-field]').forEach((element) => {
      set(this.fields, element.dataset.field!, element);
    });

    this.modal.querySelectorAll<HTMLElement>('[data-button]').forEach((element) => {
      set(this.buttons, element.dataset.button!, element);
    });
  }

  protected setTitle(title: string, options?: { icon: string | null }): void {
    this.modal.querySelector('.modal-title span')!.innerHTML = options?.icon
      ? `${createIcon(options.icon)} ${title}`
      : title;
  }

  protected setContent(content: ModalContent, reload?: boolean): void {
    if (typeof content === 'string') {
      this.modal.querySelector('.modal-content')!.innerHTML = content;
    } else {
      const elements = typeof content === 'function' ? content() : content;

      if (Array.isArray(elements)) {
        this.modal.querySelector('.modal-content')!.replaceChildren(...elements);
      } else {
        this.modal.querySelector('.modal-content')!.replaceChildren(elements);
      }
    }

    if (reload) {
      this.reloadUIElements();
    }
  }

  protected setButtons(buttons: ModalButton[], reload?: boolean): void {
    if (buttons == null || buttons.length === 0) {
      this.modal.querySelector('.modal-buttons')!.innerHTML = '';

      return;
    }

    const list: string[] = [];

    buttons.forEach((button) => {
      if (button === 'spacer') {
        list.push('<div class="spacer"></div>');
      } else if (typeof button === 'string') {
        list.push(`<button class="${button}" data-button="${button}">${startCase(button)}</button>`);
      } else if (typeof button === 'object') {
        Object.entries(button).forEach(([key, value]) => {
          list.push(createButton(key, value));
        });
      }
    });

    this.modal.querySelector('.modal-buttons')!.innerHTML = list.join(' ');

    if (reload) {
      this.reloadUIElements();
    }
  }

  protected disableButtons(): void {
    Object.values(this.buttons).forEach((button) => {
      if (button instanceof HTMLElement) {
        button.setAttribute('disabled', '');
      }
    });
  }

  protected enableButtons(): void {
    Object.values(this.buttons).forEach((button) => {
      if (button instanceof HTMLElement) {
        button.removeAttribute('disabled');
      }
    });
  }

  protected addEventListeners() {
    this.modal
      .querySelector<HTMLAnchorElement>('a.modal-close')
      ?.addEventListener('click', this.closeButtonClicked.bind(this));

    this.modal
      .querySelector<HTMLDivElement>('.modal-title')
      ?.addEventListener('mousedown', this.onMouseDown.bind(this));

    addGlobalListeners();

    if (this.buttons.cancel && this.buttons.cancel instanceof HTMLElement) {
      this.buttons.cancel.addEventListener('click', this.cancel.bind(this));
    }
  }

  protected focusFirstInput(): void {
    if (/iPad|iPhone|iPod/g.test(navigator.userAgent)) {
      // Focus requires a slight physical scroll on iOS 8.4
      return;
    }

    const firstInput = [...this.modal.querySelectorAll<HTMLInputElement>('input, select, textarea')]
      .find((element) => isVisible(element) && !element.disabled && !element.readOnly);

    firstInput?.focus();
  }

  public async open(reopening?: boolean): Promise<T> {
    if (this.#locked || this.modal.classList.contains('open')) {
      return this.promise;
    }

    this.#locked = true;

    if (openModals.includes(this)) {
      pull(openModals, this);
    }

    openModals.push(this);

    fire(this.modal, 'modal:opening');

    if (openModals.length > 1) {
      // Hide the modal immediately previous to this one.
      openModals.at(-2)?.hide();
    } else {
      // There are no open modals - show the background overlay
      toggleOverlay(true);
    }

    const { top } = document.body.getBoundingClientRect();

    this.modal.style.top = `${-top + (this.setting('distanceFromTop') ?? 0)}px`;

    setTimeout(() => {
      this.modal.classList.add('open');

      animate(this.modal, 'fadeInDown', {}, () => {
        this.#locked = false;

        fire(this.modal, 'modal:opened');

        this.focusFirstInput();
      });
    }, 125);

    if (reopening && this.promise != null) {
      return this.promise;
    }

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    return this.promise;
  }

  public close(openPrevious = true): void {
    if (this.#locked || !this.modal.classList.contains('open')) {
      return;
    }

    this.#locked = true;

    if (!openPrevious || openModals.length === 1) {
      toggleOverlay(false);
    }

    // Remove the top-most modal (this one) from the stack
    openModals.pop();

    setTimeout(() => {
      animate(this.modal, 'fadeOutUp', {}, () => {
        fire(this.modal, 'modal:closed');

        this.modal.classList.remove('open');

        this.#locked = false;
      });

      if (openPrevious) {
        openPreviousModal();
      } else {
        hideAllModals();
      }
    }, 125);
  }

  // Just hide the modal immediately and don't bother with an overlay
  public hide(): void {
    this.#locked = false;

    this.modal.classList.remove('open');
  }

  protected cancel(): void {
    this.close();
  }

  protected createModal(): HTMLDivElement {
    // Join and split in case any of the classes include spaces
    const classes = this.defaultClasses()
      .join(' ')
      .split(' ');

    const element = elementFromString<HTMLDivElement>(template);
    element.classList.add(...classes);

    // Accessibility
    element.setAttribute('aria-labelledby', `modal_${this.modalId}_title`);
    element.querySelector('.modal-title span')!.setAttribute('id', `modal_${this.modalId}_title`);

    document.body.append(element);

    return element;
  }

  protected defaultClasses(): string[] {
    return [this.setting('size'), this.setting('type')].filter(Boolean) as string[];
  }

  protected closeButtonClicked(event: UIEvent): false {
    stopEverything(event);

    this.close();

    return false;
  }

  protected onMouseDown(event: MouseEventInit): void {
    this.modal.classList.add('dragging');

    onMouseMove = this.onMouseMove.bind(this);
    onMouseUp = this.onMouseUp.bind(this);

    // If we've already dragged the modal previously, it won't be in its starting position anymore
    const currentTranslation = /translate\((-?\d+)px, (-?\d+)px\)/.exec(this.modal.style.transform);

    dragState.xOffset = currentTranslation ? Number.parseInt(currentTranslation[1], 10) : 0;
    dragState.yOffset = currentTranslation ? Number.parseInt(currentTranslation[2], 10) : 0;

    dragState.mouseDownX = event.screenX!;
    dragState.mouseDownY = event.screenY!;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  protected onMouseMove(event: MouseEventInit): void {
    const xTranslation = event.screenX! - dragState.mouseDownX + dragState.xOffset;
    const yTranslation = event.screenY! - dragState.mouseDownY + dragState.yOffset;

    this.modal.style.transform = `translate(${xTranslation}px, ${yTranslation}px)`;
  }

  protected onMouseUp(): void {
    this.modal.classList.remove('dragging');

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}
