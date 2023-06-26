export default class Listenable {
  protected listeners: { [s: string]: ((event: CustomEvent) => void)[] };

  public addEventListener(type: string, listener: (event: CustomEvent) => void): void;
  public removeEventListener(type: string, listener: (event: CustomEvent) => void): void;

  public dispatchEvent(event: CustomEvent): boolean;
}
