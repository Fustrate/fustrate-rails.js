import type Listenable from '../listenable';

interface UIElements {
  [s: string]: HTMLElement | UIElements | UIElements[];
}

type ModalButton = 'spacer' | string | { [s: string]: string | { text?: string, type?: string } }

export interface ModalSettings {
    buttons?: ModalButton[];
    closeOnBackgroundClick?: boolean;
    content?: string;
    distanceFromTop?: number;
    icon?: string;
    size?: string;
    title?: string;
    type?: string;
}

export default class Modal<T = void> extends Listenable {
  protected buttons: UIElements;
  protected fields: UIElements;
  protected modalId: number;
  protected settings: ModalSettings;
  protected modal: HTMLDivElement;

  protected promise: Promise<T>;
  protected resolve: (value?: T) => void;
  protected reject: (reason?: any) => void;

  public constructor(settings?: ModalSettings);

  public static hideAllModals(): void;

  protected static get settings(): ModalSettings;

  protected static backgroundClicked(): false;
  protected static keyPressed(event: UIEvent): void;

  public close(openPrevious?: boolean): void;
  public hide(): void;
  public open(reopening?: boolean): Promise<T>;

  protected addEventListeners(): void;
  protected cancel(): void;
  protected closeButtonClicked(event: UIEvent): false;
  protected createModal(): HTMLDivElement;
  protected defaultClasses(): string[];
  protected focusFirstInput(): void;
  protected initialize(): void;
  protected openPreviousModal(): void;
  protected reloadUIElements(): void;
  protected setButtons(buttons: ModalButton[], reload?: boolean): void;
  protected disableButtons(): void;
  protected enableButtons(): void;
  protected setContent(content: string, reload?: boolean): void;
  protected setTitle(title: string, options?: { icon?: string }): void;
}
