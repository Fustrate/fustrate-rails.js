import { type HTMLEvent, delegate, stopEverything } from '../events';

export default class Tabs {
  protected tabs: HTMLUListElement;

  public constructor(tabs: HTMLUListElement) {
    this.tabs = tabs;

    delegate<HTMLEvent<HTMLAnchorElement>>(this.tabs, 'li > a', 'click', (event) => {
      stopEverything(event);

      this.activateTab(event.target, true);

      return false;
    });

    if (window.location.hash) {
      this.tabs.querySelector(`li > a[href='${window.location.hash}']`);

      const tab = this.tabs.querySelector<HTMLAnchorElement>(`li > a[href='${window.location.hash}']`);

      if (tab) {
        this.activateTab(tab, false);
      }
    } else {
      const tabWithActiveClass = this.tabs.querySelector<HTMLAnchorElement>('li > a.active');

      if (tabWithActiveClass) {
        this.activateTab(tabWithActiveClass, false);
      } else {
        // Open the first tab by default
        const firstTab = this.tabs.querySelector<HTMLAnchorElement>('li > a');

        if (firstTab) {
          this.activateTab(firstTab, false);
        }
      }
    }
  }

  protected activateTab(tab: HTMLAnchorElement, changeHash: boolean): void {
    const link = tab.closest('a');

    if (link == null) {
      return;
    }

    for (const sibling of this.tabs.querySelectorAll('.active')) {
      sibling.classList.remove('active');
    }

    link.classList.add('active');
    const hash = link.href.split('#')[1];

    if (changeHash) {
      window.location.hash = hash;
    }

    const tabContent = document.querySelector(`#${hash}`);

    if (tabContent?.parentElement == null) {
      return;
    }

    tabContent.classList.add('active');

    for (const sibling of tabContent.parentElement.children) {
      if (sibling !== tabContent) {
        sibling.classList.remove('active');
      }
    }
  }
}

export function initialize(): void {
  for (const ul of document.querySelectorAll<HTMLUListElement>('ul.tabs')) new Tabs(ul);
}
