import { HTMLEvent, delegate, stopEverything } from '../events';
import Listenable from '../listenable';

export default class Tabs extends Listenable {
  protected tabs: HTMLUListElement;

  public constructor(tabs: HTMLUListElement) {
    super();

    this.tabs = tabs;

    delegate<HTMLEvent<HTMLAnchorElement>>(this.tabs, 'li > a', 'click', (event) => {
      stopEverything(event);

      this.activateTab(event.target, true);

      return false;
    });

    if (window.location.hash) {
      this.tabs.querySelector(`li > a[href='${window.location.hash}']`);

      this.activateTab(this.tabs.querySelector(`li > a[href='${window.location.hash}']`), false);
    } else {
      const tabWithActiveClass = this.tabs.querySelector<HTMLAnchorElement>('li > a.active');

      if (tabWithActiveClass) {
        this.activateTab(tabWithActiveClass, false);
      } else {
        // Open the first tab by default
        this.activateTab(this.tabs.querySelector('li > a'), false);
      }
    }
  }

  protected activateTab(tab: HTMLAnchorElement, changeHash: boolean): void {
    if (!tab) {
      return;
    }

    const link = tab.closest('a');

    [...this.tabs.querySelectorAll('.active')].forEach((sibling) => {
      sibling.classList.remove('active');
    });

    link.classList.add('active');
    const hash = link.getAttribute('href').split('#')[1];

    if (changeHash) {
      window.location.hash = hash;
    }

    const tabContent = document.querySelector(`#${hash}`);

    tabContent.classList.add('active');

    [...tabContent.parentElement.children].forEach((sibling) => {
      if (sibling !== tabContent) {
        sibling.classList.remove('active');
      }
    });
  }

  public static initialize(): void {
    [...document.querySelectorAll<HTMLUListElement>('ul.tabs')].forEach((ul) => new Tabs(ul));
  }
}
