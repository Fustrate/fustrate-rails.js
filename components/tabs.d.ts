import type Listenable from '../listenable';

export default class Tabs extends Listenable {
  protected tabs: HTMLUListElement;

  public constructor(tabs: HTMLUListElement);

  public static initialize(): Tabs;

  protected activateTab(tab: HTMLLIElement, changeHash: boolean): void;
}
