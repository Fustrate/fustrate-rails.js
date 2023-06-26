interface UIElements {
  [s: string]: HTMLElement | UIElements | UIElements[];
}

export default class GenericPage {
  protected fields: UIElements;
  protected buttons: UIElements;
  protected allMethodNamesList: string[];

  public initialize(): Promise<any>;
  public refresh(): void;

  protected addEventListeners(): void;
  protected reloadUIElements(): void;
  protected setHeader(text: string): void;
}

export function button(buttonName: string): MethodDecorator;

export function onChange(fieldName: string): MethodDecorator;

export function onDoubleClick(buttonName: string): MethodDecorator;

export function onClick(name: string): MethodDecorator;

export function refresh(): MethodDecorator;
