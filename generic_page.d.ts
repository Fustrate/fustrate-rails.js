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

export const button: (buttonName: string) => MethodDecorator;

export const onChange: (fieldName: string) => MethodDecorator;

export const onDoubleClick: (buttonName: string) => MethodDecorator;

export const onClick: (name: string) => MethodDecorator;

export const refresh: MethodDecorator;
